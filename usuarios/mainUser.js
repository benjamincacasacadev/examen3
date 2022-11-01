import solicdb, {
  bulkcreate,
  createEle,
  getDataUser,
  SortObjUser,
} from "/solicitudes/module.js";


let db = solicdb("SolicitudDB", {
  usuarios: `++id, nombre, carnet, celular`,
});

// input tags
const userid = document.getElementById("userid");
const nombre = document.getElementById("nombre");
const carnet = document.getElementById("carnet");
const celular = document.getElementById("celular");

const useridedit = document.getElementById("useridedit");
const nombreedit = document.getElementById("nombreedit");
const carnetedit = document.getElementById("carnetedit");
const celularedit = document.getElementById("celularedit");

// create button
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

// user data

// event listerner for create button
btncreate.onclick = event => {
  // insert values
  let flag = bulkcreate(db.usuarios, {
    nombre: nombre.value,
    carnet: carnet.value,
    celular: celular.value,
  });
  // reset textbox values
  nombre.value = carnet.value = celular.value = "";

  // set id textbox value
  getDataUser(db.usuarios, data => {
    userid.value = data.id + 1 || 1;
  });
  table();

  alert("Creado con exito");
};


// event listerner for create button
btnread.onclick = table;

// button update
btnupdate.onclick = () => {
  const id = parseInt(useridedit.value || 0);

  if (id) {
    console.log(id);
    // call dexie update method
    db.usuarios.update(id, {
      nombre: nombreedit.value,
      carnet: carnetedit.value,
      celular: celularedit.value,
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;

      // display message
      alert("Actualizado con exito");
      table();

      nombreedit.value = carnetedit.value = celularedit.value = "";
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
    usuarios: `++id, nombre, carnet, celular`,
  });
  db.open();
  table();
  textID(userid);
}

window.onload = event => {
  // set id textbox value
  textID(userid);
};




// create dynamic table
function table() {
  const tbody = document.getElementById("tbody");
  const notfound = document.getElementById("notfound");
  notfound.textContent = "";
  // remove all childs from the dom first
  while (tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }


  getDataUser(db.usuarios, (data, index) => {
    console.log(data);
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
  $('#modalEditUsers').modal('show');

  let id = parseInt(event.target.dataset.id);
  db.usuarios.get(id, function (data) {
    let newdata = SortObjUser(data);
    useridedit.value = newdata.id || 0;
    nombreedit.value = newdata.nombre || "";
    carnetedit.value = newdata.carnet || "";
    celularedit.value = newdata.celular || "";
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
  db.usuarios.delete(id);
  table();
}

// textbox id
function textID(textboxid) {
  getDataUser(db.usuarios, data => {
    textboxid.value = data.id + 1 || 1;
  });
}
