import solicdb, {
  bulkcreate,
  createEle,
  getData,
  SortObj,
  getDataUser,
  SortObjUser,
} from "./module.js";


let db = solicdb("SolicitudDB", {
  solicitudes: `++id, descripcion, region, solicitante, fecha`,
  usuarios: `++id, nombre, carnet, celular`,
  materiales: `++id, material, cantidad, tipo`
});

// input tags
const userid = document.getElementById("userid");
const descripcion = document.getElementById("descripcion");
const region = document.getElementById("region");
const solicitante = document.getElementById("solicitante");
const fecha = document.getElementById("fecha");


const useridedit = document.getElementById("useridedit");
const descripcionedit = document.getElementById("descripcionedit");
const regionedit = document.getElementById("regionedit");
const solicitanteedit = document.getElementById("solicitanteedit");
const fechaedit = document.getElementById("fechaedit");

// create button
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

// user data

// event listerner for create button
btncreate.onclick = event => {
  // insert values
  let flag = bulkcreate(db.solicitudes, {
    descripcion: descripcion.value,
    region: region.value,
    solicitante: solicitante.value,
    fecha: fecha.value
  });
  // reset textbox values
  descripcion.value = region.value = solicitante.value = fecha.value = "";

  // set id textbox value
  getData(db.solicitudes, data => {
    userid.value = data.id + 1 || 1;
  });

  table();

  var selectList = document.getElementById("solicitante");
  var selectListEdit = document.getElementById("solicitanteedit");
  removeOptions(selectList);
  removeOptions(selectListEdit);

  alert("Creado con exito");
};


// event listerner for create button
btnread.onclick = table;

// button update
btnupdate.onclick = () => {
  const id = parseInt(useridedit.value || 0);

  if (id) {
    console.log(id);
    console.log(regionedit.value);
    // call dexie update method
    db.solicitudes.update(id, {
      descripcion: descripcionedit.value,
      region: regionedit.value,
      solicitante: solicitanteedit.value,
      fecha: fechaedit.value
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;

      // display message
      alert("Actualizado con exito");
      table();

      descripcion.value = region.value = solicitante.value = fecha.value = "";
      //console.log(get);
    })
  } else {
    console.log(`Please Select id: ${id}`);
  }
}

// delete button
btndelete.onclick = () => {
  db.delete();
  db = solicdb("SolicitudDB", {
    products: `++id, name, seller, price`
  });
  db.open();
  table();
  textID(userid);
}

window.onload = event => {
  // set id textbox value
  textID(userid);
};

function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for(i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}

// create dynamic table
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  // remove all childs from the dom first
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  //Create array of options to be added
  // var array = ["Volvo","Saab","Mercades","Audi"];
  var selectList = document.getElementById("solicitante");
  selectList.className = "form-select";

  var selectListEdit = document.getElementById("solicitanteedit");
  selectListEdit.className = "form-select";

  getDataUser(db.usuarios, data => {
    var option = document.createElement("option");
    option.value = data.nombre;
    option.text = data.nombre;
    selectList.appendChild(option);
    selectListEdit.appendChild(option);
  });

  getData(db.solicitudes, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            td.textContent = data[value];
          });
        }
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-edit btnedit text-primary cursor-pointer";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = editbtn;
          });
        })
        createEle("td", tr, td => {
          createEle("i", td, i => {
            i.className += "fas fa-trash-alt btndelete text-red cursor-pointer";
            i.setAttribute(`data-id`, data.id);
            // store number of edit buttons
            i.onclick = deleteConfirmation;
          });
        })
      });
    } else {
      notfound.textContent = "No record found in the database...!";
    }

  });
}

const editbtn = (event) => {
  $('#modalEditSolicitudes').modal('show');

  let id = parseInt(event.target.dataset.id);
  db.solicitudes.get(id, function (data) {
    let newdata = SortObj(data);
    useridedit.value = newdata.id || 0;
    descripcionedit.value = newdata.descripcion || "";
    regionedit.value = newdata.region || "";
    solicitanteedit.value = newdata.solicitante || "";
    fechaedit.value = newdata.fecha || "";
  });
}

// delete icon remove element

const deleteConfirmation = event => {
  console.log(event.target.dataset.id);
  $('#modalEliminar').modal('show');

  const btndeleteModal = document.getElementById("delete-btn");
  btndeleteModal.setAttribute(`data-id`, event.target.dataset.id);
  btndeleteModal.onclick = deletebtn;
}

const deletebtn = event => {
  let id = parseInt(event.target.dataset.id);
  db.solicitudes.delete(id);
  table();
}

// textbox id
function textID(textboxid) {
  getData(db.solicitudes, data => {
    textboxid.value = data.id + 1 || 1;
  });
}
