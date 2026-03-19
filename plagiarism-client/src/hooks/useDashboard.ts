import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../lib/api';

export const useDashboard = () => {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ['dashboard-stats'],
		queryFn: () => dashboardAPI.getStats(),
	});

	// Transform backend response to match frontend expectations
	const transformedStats = data?.data
		? {
				totalStudents: data.data.studentCount,
				totalLecturers: data.data.lecturerCount,
				totalCourses: data.data.courseCount,
				totalSubmissions: data.data.documentCount,
				totalFaculties: data.data.facultyCount,
			}
		: null;

	return {
		stats: transformedStats,
		isLoading,
		error,
		refetch,
	};
};
