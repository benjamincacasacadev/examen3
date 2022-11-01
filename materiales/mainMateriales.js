import solicdb, {
  bulkcreate,
  createEle,
  getDataMaterial,
  SortObjMaterial,
} from "/solicitudes/module.js";


let db = solicdb("SolicitudDB", {
  solicitudes: `++id, descripcion, region, solicitante, fecha`,
  usuarios: `++id, nombre, carnet, celular`,
  materiales: `++id, material, cantidad, tipo`
});

// input tags
const userid = document.getElementById("userid");
const material = document.getElementById("material");
const cantidad = document.getElementById("cantidad");
const tipo = document.getElementById("tipo");

const useridedit = document.getElementById("useridedit");
const materialedit = document.getElementById("materialedit");
const cantidadedit = document.getElementById("cantidadedit");
const tipoedit = document.getElementById("tipoedit");

// create button
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

// user data

// event listerner for create button
btncreate.onclick = event => {
  // insert values
  let flag = bulkcreate(db.materiales, {
    material: material.value,
    cantidad: cantidad.value,
    tipo: tipo.value,
  });
  // reset textbox values
  material.value = cantidad.value = tipo.value = "";

  // set id textbox value
  getDataMaterial(db.materiales, data => {
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
    db.materiales.update(id, {
      material: materialedit.value,
      cantidad: cantidadedit.value,
      tipo: tipoedit.value,
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;

      // display message
      alert("Actualizado con exito");
      table();

      materialedit.value = cantidadedit.value = tipoedit.value = "";
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
    materiales: `++id, material, cantidad, tipo`,
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


  getDataMaterial(db.materiales, (data, index) => {
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
  $('#modalEditMaterial').modal('show');

  let id = parseInt(event.target.dataset.id);
  db.materiales.get(id, function (data) {
    let newdata = SortObjMaterial(data);
    useridedit.value = newdata.id || 0;
    materialedit.value = newdata.material || "";
    cantidadedit.value = newdata.cantidad || "";
    tipoedit.value = newdata.tipo || "";
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
  db.materiales.delete(id);
  table();
}

// textbox id
function textID(textboxid) {
  getDataMaterial(db.materiales, data => {
    textboxid.value = data.id + 1 || 1;
  });
}
