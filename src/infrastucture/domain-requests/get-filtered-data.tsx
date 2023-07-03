import {URLS} from '../../const/urls';

interface Item {
  batch: string | boolean;
  batchYear: string | boolean;
  detailNumber: string | string[];
}

const getFilteredData = async (
  detailNumber: string,
  batch: string,
  batchYear: string,
): Promise<Item[]> => {
  try {
    const response = await fetch(URLS.SERVER_URL);
    const json = await response.json();

    // Фильтрация данных на основе detailNumber
    const filteredItems = json.data.filter(
      (item: Item) =>
        item.detailNumber &&
        item.detailNumber === detailNumber &&
        item.batch &&
        item.batch === batch &&
        item.batchYear &&
        item.batchYear === batchYear,
    );
    return filteredItems;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getFilteredData;
