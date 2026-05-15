import { CheckCircle, XCircle, AlertCircle, Pause, Bug, FileCheck } from 'lucide-react';
import { KPICard } from './KPIcard';
import { DailyExecutionChart } from './DailyExecutionChart';
import { FailureTrendChart } from './FailureTrendChart';
import { ModuleHeatmap } from './ModuleHeatmap';
import { PassFailDistribution } from './PassFailDistribution';
import { RecentActivity } from './RecentActivity';

export function OverviewDashboard() {
  return (
    <div className="space-y-8">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <KPICard
          title="Total Test Cases Executed"
          value="1,247"
          trend={12.5}
          icon={FileCheck}
          sparklineData={[820, 932, 901, 934, 1290, 1330, 1247]}
          iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
        />

        <KPICard
          title="Pass Percentage"
          value="94.2%"
          trend={3.2}
          icon={CheckCircle}
          sparklineData={[91, 92, 91.5, 93, 94, 93.8, 94.2]}
          iconBg="bg-gradient-to-br from-green-500 to-green-600"
        />

        <KPICard
          title="Failed Test Cases"
          value="72"
          trend={-8.3}
          icon={XCircle}
          sparklineData={[95, 102, 98, 87, 79, 76, 72]}
          iconBg="bg-gradient-to-br from-red-500 to-red-600"
        />

        <KPICard
          title="Blocked Test Cases"
          value="18"
          trend={-15.2}
          icon={Pause}
          sparklineData={[32, 28, 25, 22, 21, 20, 18]}
          iconBg="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />

        <KPICard
          title="Critical Failures"
          value="5"
          trend={-40}
          icon={AlertCircle}
          sparklineData={[12, 10, 9, 8, 7, 6, 5]}
          iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
        />

        <KPICard
          title="Total Bugs Logged"
          value="142"
          trend={5.8}
          icon={Bug}
          sparklineData={[120, 125, 128, 134, 138, 140, 142]}
          iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DailyExecutionChart />
        <FailureTrendChart />
      </div>

      {/* Heatmap + Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ModuleHeatmap />
        </div>

        <div>
          <PassFailDistribution />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />

    </div>
  );
}