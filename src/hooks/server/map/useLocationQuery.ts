import { ParalledQueriesAnimalMedicineAPI } from '@/components/map/api/seoul_api';
import { refineSeoulApiData } from '@/components/map/utility/map-utils';
import {} from '@/lib/utils';
import { useQueries, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
interface I_QueryProps {
  api_type: 'hospital' | 'walk';
  api_query: string | null;
}
enum LOCATION_QUERY {
  HOSPITAL = 'hospital',
  PHARMACY = 'pharmacy',
  PARK = 'park',
}
const DYNAMIC_API_QURIES = [
  { api_name: 'animal_hospital', query_key: 'LOCALDATA_020301_' },
  { api_name: 'animal_pharmacy', query_key: 'LOCALDATA_020302_' },
];
// api_type에 따라서 병원&약국 아니면 산책로
// api_query에 따라서 각 지역구를 호출
// api_query가 null이면 호출 하지 않기
// kakao 내장 검색으로 위치 찾으면 호출 하지 않기

const useLocationQuery = (props: I_QueryProps) => {
  const { api_type, api_query } = props;

  const queries = DYNAMIC_API_QURIES.map(({ api_name, query_key }) => ({
    queryKey: ['ORIGIN', api_query, api_name],
    queryFn: async () => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SEOUL_API_URL}`, {
        api_query,
        api_name,
        query_key,
      });
      return response.data; // 데이터를 반환
    },
    enabled: !!api_query && api_type === 'hospital',
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  }));

  const results = useQueries({
    queries,
  });

  // useQuery+Promise.all
  const {
    data: medicine,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: [LOCATION_QUERY.HOSPITAL, api_query],
    queryFn: () => {
      return ParalledQueriesAnimalMedicineAPI(api_query);
    },
    enabled: !!api_query && api_type === 'hospital',
    select: data => {
      const result = refineSeoulApiData(data);

      return result;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!!api_query && api_type === 'hospital') {
      console.time(`${api_query} useQueries Performance`);
      console.time(`${api_query} useQuery+promise.all`);
    }
  }, [api_query, api_type]);

  useEffect(() => {
    if (!!api_query && api_type === 'hospital') {
      if (isSuccess) {
        console.timeEnd(`${api_query} useQuery+promise.all`);
      }
      const allSuccess = results.every(result => result.status === 'success');

      if (allSuccess) {
        const refinedResults = results.map(result => result.data);
        const allResults = refineSeoulApiData(refinedResults);

        console.timeEnd(`${api_query} useQueries Performance`);

        // 여기서 데이터를 처리할 수 있습니다.
        // 예: setProcessedData(allResults);
      }
    }
  }, [results, api_query, api_type, isSuccess]);
  return {
    medicine,
    isGetRequestApiData: isLoading,
  };
};

export default useLocationQuery;
