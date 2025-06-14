import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload, User, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
interface ProfileEditPageProps {
  onBack: () => void;
}
const ProfileEditPage = ({
  onBack
}: ProfileEditPageProps) => {
  const {
    user
  } = useAuth();
  const {
    t
  } = useLanguage();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [languagePreference, setLanguagePreference] = useState<'english' | 'uzbek'>('english');
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  const fetchProfile = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      if (data) {
        setUsername(data.username || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
        setLanguagePreference(data.language_preference === 'uzbek' ? 'uzbek' : 'english');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFetchingProfile(false);
    }
  };
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) {
        toast.error('Error uploading file: ' + uploadError.message);
        return;
      }
      const {
        data
      } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const {
        error
      } = await supabase.from('profiles').upsert({
        id: user.id,
        username,
        bio,
        avatar_url: avatarUrl,
        language_preference: languagePreference,
        updated_at: new Date().toISOString()
      });
      if (error) {
        toast.error('Error updating profile: ' + error.message);
      } else {
        toast.success('Profile updated successfully!');
        onBack();
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };
  if (fetchingProfile) {
    return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">{t.profile.loadingProfile}</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">{t.profile.editProfile}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required className="rounded" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." className="min-h-[80px] rounded" />
              </div>
              
              {/* Language Preference Switcher */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Language Preference
                </Label>
                <div className="relative">
                  <div className="flex p-1 transition-all duration-300 bg-green-400 rounded-xl">
                    <button type="button" onClick={() => setLanguagePreference('english')} className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 relative ${languagePreference === 'english' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                      <span className="relative z-10 text-lg">English</span>
                      {languagePreference === 'english' && <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-md opacity-50" />}
                    </button>
                    <button type="button" onClick={() => setLanguagePreference('uzbek')} className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 relative ${languagePreference === 'uzbek' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                      <span className="relative z-10 text-lg">O'zbek</span>
                      {languagePreference === 'uzbek' && <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-emerald-100 opacity-50 bg-slate-50 rounded-sm" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Choose your preferred language for wildlife species information
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {avatarUrl ? <img src={avatarUrl} alt="Current avatar" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" /> : <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>}
                  </div>
                  <div className="flex-1">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full text-base font-normal rounded">
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      Max 5MB. JPG, PNG, GIF supported.
                    </p>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-500 rounded">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default ProfileEditPage;