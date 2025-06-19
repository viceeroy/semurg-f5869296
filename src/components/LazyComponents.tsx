import { lazy, Suspense } from 'react';
import LoadingSkeleton from './LoadingSkeleton';

// Lazy load heavy components
const CollectionsPage = lazy(() => import('./CollectionsPage'));
const SearchPage = lazy(() => import('./SearchPage'));
const ProfilePage = lazy(() => import('./ProfilePage'));
const UploadFlow = lazy(() => import('./UploadFlow'));
const DetailedPostView = lazy(() => import('./DetailedPostView'));
const ExpandedPostView = lazy(() => import('./ExpandedPostView'));

// Wrapper components with suspense
export const LazyCollectionsPage = ({ collectionsData }: { collectionsData: any }) => (
  <Suspense fallback={<div className="p-4 space-y-4">{Array.from({length: 3}).map((_, i) => <LoadingSkeleton key={i} variant="card" />)}</div>}>
    <CollectionsPage collectionsData={collectionsData} />
  </Suspense>
);

export const LazySearchPage = ({ searchData }: { searchData: any }) => (
  <Suspense fallback={<div className="p-4 space-y-4">{Array.from({length: 5}).map((_, i) => <LoadingSkeleton key={i} variant="post" />)}</div>}>
    <SearchPage searchData={searchData} />
  </Suspense>
);

export const LazyProfilePage = ({ profileData, onEditProfile }: { profileData: any; onEditProfile: () => void }) => (
  <Suspense fallback={<div className="p-4"><LoadingSkeleton variant="card" lines={6} /></div>}>
    <ProfilePage profileData={profileData} onEditProfile={onEditProfile} />
  </Suspense>
);

export const LazyUploadFlow = (props: any) => (
  <Suspense fallback={<div className="p-4"><LoadingSkeleton variant="image" /></div>}>
    <UploadFlow {...props} />
  </Suspense>
);

export const LazyDetailedPostView = (props: any) => (
  <Suspense fallback={<div className="p-4"><LoadingSkeleton variant="post" /></div>}>
    <DetailedPostView {...props} />
  </Suspense>
);

export const LazyExpandedPostView = (props: any) => (
  <Suspense fallback={<div className="p-4"><LoadingSkeleton variant="post" /></div>}>
    <ExpandedPostView {...props} />
  </Suspense>
);