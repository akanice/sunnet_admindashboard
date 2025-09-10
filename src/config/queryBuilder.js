const queryBuilder = (searchFields = {}, options = {}) => {
    let searchValues = [];
    let searchTypes = [];
  
    Object.keys(searchFields).forEach(key => {
      const field = searchFields[key];
  
      if (typeof field === 'string') {
        searchValues.push(`${key}:${field}`);
        searchTypes.push(`${key}:=`);
      } else if (field.value !== '' && field.type) {
        searchValues.push(`${key}:${field.value}`);
        searchTypes.push(`${key}:${field.type}`);
      }
    });
  
    if (searchValues.length && searchTypes.length) {
      return {
        search: searchValues.join(';'),
        searchFields: searchTypes.join(';'),
        searchJoin: options.searchJoin || 'AND',
      };
    }
  
    // Trường hợp không có gì
    return {};
  };
  
export default queryBuilder;