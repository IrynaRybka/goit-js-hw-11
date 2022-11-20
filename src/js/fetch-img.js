import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '31302238-3bbf3bf14ed620b40113bc545'

// Fetch images from Pixabay API using Axios

async function fetchImg(name, page, perPage) {
  try {
    const response = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.log('ERROR: ' + error);
  }
}
export{fetchImg}

