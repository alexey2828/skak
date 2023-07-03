import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

interface RequestData {
  serverUrl: string;
  urlParam: string;
  [key: string]: any;
}

const addRecordToDatabase = async (requestData: RequestData): Promise<any> => {
  try {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const response: AxiosResponse = await axios.post(
      requestData.serverUrl + requestData.urlParam,
      requestData,
      config,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {addRecordToDatabase};
