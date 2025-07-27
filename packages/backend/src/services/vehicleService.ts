import axios from 'axios';

export async function getVehicleDetailsByDegem(degem: string) {
  const url = 'https://data.gov.il/api/3/action/datastore_search';
  const params = {
    resource_id: '142afde2-6228-49f9-8a29-9b6c3a0cbe40',
    q: degem,
    limit: 5,
  };

  const response = await axios.get(url, { params });
  const vehicleData = response.data.result.records;

  if (vehicleData.length > 0) {
    const vehicle = vehicleData[0];
    return {
      mishkal_kolel: vehicle.mishkal_kolel || 'לא זמין',
      gova: vehicle.gova || 'לא זמין',
    };
  } else {
    throw new Error('לא נמצאו תוצאות עבור הדגם');
  }
}
