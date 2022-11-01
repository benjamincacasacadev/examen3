const solicitudesdb = (dbname, table) => {
  const db = new Dexie(dbname);
  db.version(1).stores(table);
  db.open();

  return db;
};

const bulkcreate = (dbtable, data) => {
  let flag = empty(data);
  if (flag) {
    dbtable.bulkAdd([data]);
    console.log("data inserted successfully...!");
  } else {
    console.log("Please provide data...!");
  }
  return flag;
};

// create dynamic elements
const createEle = (tagname, appendTo, fn) => {
  const element = document.createElement(tagname);
  if (appendTo) appendTo.appendChild(element);
  if (fn) fn(element);
};

// check textbox validation
const empty = object => {
  let flag = false;
  for (const value in object) {
    if (object[value] != "" && object.hasOwnProperty(value)) {
      flag = true;
    } else {
      flag = false;
    }
  }
  return flag;
};

// getData from the database
const getData = (dbname, fn) => {
  let index = 0;
  let obj = {};
  dbname.count(count => {
    // count rows in the table using count method
    if (count) {
      dbname.each(table => {
        // table => return the table object data
        // to arrange order we are going to create for in loop
        obj = SortObj(table);
        fn(obj, index++); // call function with data argument
      });
    } else {
      fn(0);
    }
  });
};

const SortObj = (sortobj) => {

  let obj = {};
  obj = {
    id: sortobj.id,
    descripcion: sortobj.descripcion,
    region: sortobj.region,
    solicitante: sortobj.solicitante,
    fecha: sortobj.fecha,
    material: sortobj.material+"+"+sortobj.materialliteral,
    cantidad: sortobj.cantidad,
    estado: sortobj.estado,
  };
  return obj;
}

// getData from the database
const getDataUser = (dbname, fn) => {
  let index = 0;
  let obj = {};
  dbname.count(count => {
    // count rows in the table using count method
    if (count) {
      dbname.each(table => {
        // table => return the table object data
        // to arrange order we are going to create for in loop
        obj = SortObjUser(table);
        fn(obj, index++); // call function with data argument
      });
    } else {
      fn(0);
    }
  });
};


const SortObjUser = (sortobj) => {
  let obj = {};
  obj = {
    id: sortobj.id,
    nombre: sortobj.nombre,
    carnet: sortobj.carnet,
    celular: sortobj.celular,
  };
  return obj;
}

// getData from the database
const getDataMaterial = (dbname, fn) => {
  let index = 0;
  let obj = {};
  dbname.count(count => {
    // count rows in the table using count method
    if (count) {
      dbname.each(table => {
        // table => return the table object data
        // to arrange order we are going to create for in loop
        obj = SortObjMaterial(table);
        fn(obj, index++); // call function with data argument
      });
    } else {
      fn(0);
    }
  });
};


const SortObjMaterial = (sortobj) => {
  let obj = {};
  obj = {
    id: sortobj.id,
    material: sortobj.material,
    cantidad: sortobj.cantidad,
    tipo: sortobj.tipo,
  };
  return obj;
}


export default solicitudesdb;
export {
  bulkcreate,
  createEle,
  getData,
  SortObj,
  getDataUser,
  SortObjUser,
  getDataMaterial,
  SortObjMaterial,
};