import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api';
import { useUserQuery } from '@/features/auth/query';

export const useChartDataQuery = () => {
    const { data: user } = useUserQuery();

    return useQuery({
        queryKey: ['chartData', user?.id],
        queryFn: () => dashboardApi.getChartData(),
        enabled: !!user,
    });
};