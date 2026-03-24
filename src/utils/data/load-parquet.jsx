import { parquetMetadata, parquetRead } from 'hyparquet';

const normalize = (value, type) => {

  // Convert legacy timestamps properly
  if(type == 'INT96'){
    return new Date(value).toISOString()
  }

  // convert BigInt
  if (typeof value === "bigint") {
    return Number(value);
  }

  // handle arrays
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  // handle objects (but not null)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalize(v)])
    );
  }

  return value;
};

const normalizeRow = (row, schema) => {
  return Object.fromEntries(
    Object.entries(row).map(([k, v]) => {
      const metaType = schema.find( itm => itm.name == k)?.type
      return [k, normalize(v,metaType)]
    })
  );
}

const loadPARQUET = async (file) => {
  
  const buffer = await file.arrayBuffer();
  const metadata = parquetMetadata(buffer);
  
  let rows = [];

  await parquetRead({
    file: buffer,
    metadata,
    rowFormat: 'object',
    onComplete: (data) => {
      rows = data.map( row => normalizeRow(row, metadata.schema) );
    },
  });

  return rows;

};

export default loadPARQUET