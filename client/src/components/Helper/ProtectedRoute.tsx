import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../../store/auth";

import { ChartAreaSkeleton } from "../../skeletons/dashboard/ChartAreaSkeleton";
import { SectionCardsSkeleton } from "../../skeletons/dashboard/SectionCardsSkeleton";
import { ServerStatsCardsSkeleton } from "../../skeletons/dashboard/ServerStatsCardsSkeleton";
import { DataTableSkeleton } from "../../skeletons/dashboard/DataTableSkeleton";

const ProtectedRoute = () => {
  const { loading, user } = useRecoilValue(authState);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark">
        <div className="mx-auto max-w-[1920px] space-y-6 rounded-[4px] p-4 sm:p-6 lg:space-y-8 lg:p-8">
          <SectionCardsSkeleton />
          <ServerStatsCardsSkeleton />
          <ChartAreaSkeleton />
          <DataTableSkeleton />
        </div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;