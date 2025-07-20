import { useEffect } from 'react';
import { useSelector, useDispatch, TypedUseSelectorHook } from 'react-redux';
import { fetchParkingData, setFilters ,Filters} from './parkingSlice';
import { RootState, AppDispatch } from '../../app/store'; 
import './parkingDashboard.css';


export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function ParkingDashboard() {
  const dispatch: AppDispatch = useDispatch();
  const { data, status, filters } = useAppSelector(state => state.parking);
  console.log('data:', data, 'status:', status, 'filters:', filters);

  const queryType = filters.queryType;
  const key = queryType.charAt(0).toUpperCase() + queryType.slice(1) + 'Query';
  const items = data ? data[key] : null;
  console.log('key:', key, 'items:', items);
  const firstKey = Object.keys(items || {})[0];
  const actualItem = items?.[firstKey];
  console.log('items:', items);
  // הצגת נתונים מיידית
  // useEffect(() => {
  //   if (filters.queryType) {
  //     dispatch(fetchParkingData(filters));
  //   }
  // }, [filters, dispatch]);
const handleQueryClick = (queryType: Filters['queryType']) => {
  dispatch(setFilters({ queryType }));
  dispatch(fetchParkingData({ queryType }));
};

  if (!filters.queryType) {
    console.log("hhhhhhhhh");

    return <p>בחר סוג שאילתה כדי להציג נתונים</p>;
  }
  console.log('data:', data, 'status:', status);
  console.log('filters:', filters);
  console.log('keys:', Object.keys(data || {}));
  console.log('items:', items);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">חניון - לוח מחוונים</h1>
      <div className="flex gap-4 mb-4">
  <button
    onClick={() => handleQueryClick('baseDay')}
    className={`border p-2 rounded ${filters.queryType === 'baseDay' ? 'bg-blue-200' : ''}`}
  >
    Base Day
  </button>
  <button
    onClick={() => handleQueryClick('baseMonth')}
    className={`border p-2 rounded ${filters.queryType === 'baseMonth' ? 'bg-blue-200' : ''}`}
  >
    Base Month
  </button>
  <button
    onClick={() => handleQueryClick('baseHour')}
    className={`border p-2 rounded ${filters.queryType === 'baseHour' ? 'bg-blue-200' : ''}`}
  >
    Base Hour
  </button>
  <button
    onClick={() => handleQueryClick('user')}
    className={`border p-2 rounded ${filters.queryType === 'user' ? 'bg-blue-200' : ''}`}
  >
    User
  </button>
  <button
    onClick={() => handleQueryClick('fullHour')}
    className={`border p-2 rounded ${filters.queryType === 'fullHour' ? 'bg-blue-200' : ''}`}
  >
    Full Hour
  </button>
  <button
    onClick={() => handleQueryClick('fullDay')}
    className={`border p-2 rounded ${filters.queryType === 'fullDay' ? 'bg-blue-200' : ''}`}
  >
    Full Day
  </button>
</div>

      {  // הצגת נתונים מיידית
      /* <div className="flex gap-4 mb-4">
        <button
          onClick={() => dispatch(setFilters({ queryType: 'baseDay' }))}
          className={`border p-2 rounded ${filters.queryType === 'baseDay' ? 'bg-blue-200' : ''}`}
        >
          Base Day
        </button>
        <button
        
          onClick={() => dispatch(setFilters({ queryType: 'baseMonth' }))}
          className={`border p-2 rounded ${filters.queryType === 'baseMonth' ? 'bg-blue-200' : ''}`}
        >
          Base Month
        </button>
        <button
          onClick={() => dispatch(setFilters({ queryType: 'baseHour' }))}
          className={`border p-2 rounded ${filters.queryType === 'baseHour' ? 'bg-blue-200' : ''}`}
        >
          Base Hour
        </button>
        <button
          onClick={() => dispatch(setFilters({ queryType: 'user' }))}
        >
          User
        </button>
        <button
          onClick={() => dispatch(setFilters({ queryType: 'fullHour' }))}
        >
          Full Hour
        </button>
        <button
          onClick={() => dispatch(setFilters({ queryType: 'fullDay' }))}
        >
          Full Day
        </button>
      </div> */}
      {status === 'loading' && <p>טוען נתונים...</p>}
  {status === 'succeeded' && actualItem && (
  <table className="table-auto border-collapse border border-gray-400 w-full mt-4">
    <thead>
      <tr>
        {Object.keys(actualItem).map((key) => (
          <th key={key} className="border border-gray-400 p-2">{key}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      <tr>
        {Object.values(actualItem).map((value, index) => (
          <td key={index} className="border border-gray-400 p-2">{String(value)}</td>
        ))}
      </tr>
    </tbody>
  </table>
)}

      {status === 'succeeded' && !actualItem && (
        <p>לא נבחרה אפשרות להצגה</p>
      )}
      {status === 'failed' && <p>שגיאה בטעינת נתונים</p>}
    </div>
  );
}
export default ParkingDashboard;




