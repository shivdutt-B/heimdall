import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/auth";
import { ChartAreaSkeleton } from "../../skeletons/dashboard/ChartAreaSkeleton";
import { SectionCardsSkeleton } from "../../skeletons/dashboard/SectionCardsSkeleton";
import { ServerStatsCardsSkeleton } from "../../skeletons/dashboard/ServerStatsCardsSkeleton";
import { DataTableSkeleton } from "../../skeletons/dashboard/DataTableSkeleton";

const ProtectedRoute = () => {
  const auth = useRecoilValue(authState);

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-bg-dark">
        <div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 rounded-[4px]">
        <SectionCardsSkeleton />
        <ServerStatsCardsSkeleton />
        <ChartAreaSkeleton />
        <DataTableSkeleton />
      </div>
      </div>
    );
  }

  if (!auth.user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;