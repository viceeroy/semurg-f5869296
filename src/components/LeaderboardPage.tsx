
import { Trophy, Medal, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import AvatarFallback from "@/components/ui/avatar-fallback";
import LoadingSpinner from "./LoadingSpinner";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const LeaderboardPage = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const {
    leaderboard,
    loading,
    selectedPeriod,
    setSelectedPeriod,
    periodLabels
  } = useLeaderboard();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-yellow-500 text-xl">🥇</span>;
      case 2:
        return <span className="text-gray-400 text-xl">🥈</span>;
      case 3:
        return <span className="text-orange-600 text-xl">🥉</span>;
      default:
        return <span className="text-gray-600 font-bold">#{rank}</span>;
    }
  };

  const getDisplayName = (entry: any) => {
    if (entry.first_name && entry.last_name) {
      return `${entry.first_name} ${entry.last_name}`;
    }
    return entry.username || 'Anonymous';
  };

  const getUserRank = () => {
    if (!user) return null;
    const userEntry = leaderboard.find(entry => entry.user_id === user.id);
    return userEntry ? userEntry.rank : null;
  };

  const userRank = getUserRank();

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-32">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'uz' ? 'Reyting' : 'Leaderboard'}
          </h1>
        </div>
        {userRank && (
          <p className="text-emerald-600 font-medium">
            {language === 'uz' ? `Siz ${userRank}-o'rindasiz!` : `You are #${userRank}!`}
          </p>
        )}
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 mb-6">
        {(['today', 'week', 'month'] as const).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
            className={`flex-1 ${
              selectedPeriod === period 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'hover:bg-emerald-50'
            }`}
          >
            {periodLabels[period]}
          </Button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.user_id}
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                entry.user_id === user?.id
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-12">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <AvatarFallback
                src={entry.avatar_url}
                name={getDisplayName(entry)}
                size="lg"
                alt="User"
              />

              {/* User Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {getDisplayName(entry)}
                </h3>
                <p className="text-sm text-gray-600">@{entry.username}</p>
              </div>

              {/* Species Count */}
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600">
                  {entry.species_count}
                </div>
                <div className="text-xs text-gray-500">
                  {language === 'uz' ? 'Topilgan turlar' : 'Species Found'}
                </div>
              </div>
            </div>
          ))}

          {leaderboard.length === 0 && !loading && (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'uz' ? 'Hali ma\'lumot yo\'q' : 'No data yet'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'uz' 
                  ? 'Birinchi bo\'lib tabiat discovery qiling!' 
                  : 'Be the first to discover wildlife!'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
