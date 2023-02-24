const content = {
  response: null,
  result: null,
};

const setContent = (response, result) => {
  switch (response) {
    case 404:
      content.response = response;
      content.result = result;
      break;
    case 400:
      content.response = response;
      content.result = result;
      break;
    case 401:
      content.response = response;
      content.result = result;
      break;
    case 500:
      content.response = response;
      result.errors !== undefined
        ? (content.result = result.errors[0].message)
        : (content.result = result);
      break;
    default:
      content.response = response;
      content.result = result;
  }
};

const getContent = () => content;

export default {
  setContent,
  getContent,
};
