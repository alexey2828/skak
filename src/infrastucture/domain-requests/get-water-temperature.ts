import {URL_PARAMS} from '../../const/url-params';
import {URLS} from '../../const/urls';

interface Item {
  batch: string | boolean;
  batchYear: string | boolean;
  detailNumber: string | string[];
}

const getWaterTemperature = async (): Promise<Item[]> => {
  try {
    const response = await fetch(
      URLS.SERVER_URL + URL_PARAMS.DB_GET_WATER_TEMPERATURE,
    );
    const json = await response.json();

    return json.data; // Возвращает все элементы без фильтров
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getWaterTemperature;
