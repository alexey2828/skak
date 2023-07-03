import axios from 'axios';

interface EditRecordRequestData {
  serverUrl: string;
  urlParam: string;
  [key: string]: any;
}

const editRecord = async (requestData: EditRecordRequestData): Promise<any> => {
  try {
    const response = await axios.post(
      requestData.serverUrl + requestData.urlParam,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {editRecord};
