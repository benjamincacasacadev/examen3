import solicdb, {
  bulkcreate,
  createEle,
  getData,
  SortObj,
  getDataUser,
  getDataMaterial,
} from "../module.js";


let db = solicdb("SolicitudDB", {
  solicitudes: `++id, descripcion, region, solicitante, fecha, material, materialliteral, cantidad, estado`,
  usuarios: `++id, nombre, carnet, celular`,
  materiales: `++id, material, cantidad, tipo`
});

// input tags
const userid = document.getElementById("userid");
const descripcion = document.getElementById("descripcion");
const region = document.getElementById("region");
const solicitante = document.getElementById("solicitante");
const fecha = document.getElementById("fecha");
const material = document.getElementById("material");
const materialliteral = document.getElementById("materialliteral");
const cantidad = document.getElementById("cantidad");


const useridedit = document.getElementById("useridedit");
const descripcionedit = document.getElementById("descripcionedit");
const regionedit = document.getElementById("regionedit");
const solicitanteedit = document.getElementById("solicitanteedit");
const materialedit = document.getElementById("materialedit");
const materialliteraledit = document.getElementById("materialliteraledit");
const cantidadedit = document.getElementById("cantidadedit");

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
    fecha: fecha.value,
    material: material.value,
    materialliteral: materialliteral.value,
    cantidad: cantidad.value,
    estado: 'P',
  });
  // reset textbox values
  descripcion.value = region.value = solicitante.value = fecha.value = material.value = materialliteral.value = cantidad.value = "";

  // set id textbox value
  getData(db.solicitudes, data => {
    userid.value = data.id + 1 || 1;
  });

  table();

  var selectList = document.getElementById("solicitante");
  var selectListEdit = document.getElementById("solicitanteedit");
  removeOptions(selectList);
  removeOptions(selectListEdit);

  var selectList = document.getElementById("material");
  var selectListEdit = document.getElementById("materialedit");
  removeOptions(selectList);
  removeOptions(selectListEdit);

  var selectList = document.getElementById("materialliteral");
  var selectListEdit = document.getElementById("materialliteraledit");
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
    // call dexie update method
    db.solicitudes.update(id, {
      descripcion: descripcionedit.value,
      region: regionedit.value,
      solicitante: solicitanteedit.value,
      fecha: fechaedit.value,
      material: materialedit.value,
      materialliteral: materialliteraledit.value,
      cantidad: cantidadedit.value,
    }).then((updated) => {
      // let get = updated ? `data updated` : `couldn't update data`;

      // display message
      alert("Actualizado con exito");
      table();

      var selectList = document.getElementById("solicitante");
      var selectListEdit = document.getElementById("solicitanteedit");
      removeOptions(selectList);
      removeOptions(selectListEdit);

      var selectList = document.getElementById("material");
      var selectListEdit = document.getElementById("materialedit");
      removeOptions(selectList);
      removeOptions(selectListEdit);

      var selectList = document.getElementById("materialliteral");
      var selectListEdit = document.getElementById("materialliteraledit");
      removeOptions(selectList);
      removeOptions(selectListEdit);


      descripcion.value = region.value = solicitante.value = fecha.value = "";
    })
  } else {
    console.log(`Please Select id: ${id}`);
  }
}

// delete button
btndelete.onclick = () => {
  db.delete();
  db = solicdb("SolicitudDB", {
    solicitudes: `++id, descripcion, region, solicitante, fecha, material, materialliteral, cantidad, estado`,
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
  var selectList = document.getElementById("solicitante");
  selectList.className = "form-select";

  getDataUser(db.usuarios, data => {
    var option = document.createElement("option");
    option.value = data.nombre;
    option.text = data.nombre;
    selectList.appendChild(option);
  });

  var selectMaterial = document.getElementById("material");
  var selectMaterialLiteral = document.getElementById("materialliteral");
  selectMaterial.className = "form-select";

  getDataMaterial(db.materiales, data => {
    var option = document.createElement("option");
    option.value = data.id;
    option.text = data.material;
    selectMaterial.appendChild(option);

    var optionLit = document.createElement("option");
    optionLit.value = data.material;
    optionLit.text = data.material;
    selectMaterialLiteral.appendChild(optionLit);
  });

  getData(db.solicitudes, (data, index) => {
    if (data) {
      createEle("tr", tbody, tr => {
        for (const value in data) {
          createEle("td", tr, td => {
            if(data.estado == data[value]){
              if(data[value] == 'V'){
                td.textContent = 'Validado';
                td.className = 'text-success bold';
              }else if(data[value] == 'P'){
                var mater = data.material.split("+");
                var idMat = mater[0] ?? '';

                td.textContent = 'Pendiente';
                td.className = 'text-orange bold cursor-pointer';
                td.title = "Clic para validar";
                td.setAttribute(`data-pk`, data.id);
                td.setAttribute(`data-id`, idMat);
                td.setAttribute(`data-cant`, data.cantidad);
                td.onclick = validatebtn;
              }
            }else if(data.material == data[value]){
              var mater = data[value].split("+");
              var idMat = mater[0] ?? '';
              var nomMat = mater[1] ?? '';
              td.textContent = nomMat;
            }else{
              td.textContent = data[value];
            }

          });
        }
        createEle("td", tr, td => {
          if(data.estado == 'P'){
            createEle("i", td, i => {
              i.className += "fas fa-edit btnedit text-primary cursor-pointer";
              i.setAttribute(`data-id`, data.id);
              i.onclick = editbtn;
            });
          }
        })
        createEle("td", tr, td => {
          if(data.estado == 'P'){
            createEle("i", td, i => {
              i.className += "fas fa-trash-alt btndelete text-red cursor-pointer";
              i.setAttribute(`data-id`, data.id);
              i.onclick = deleteConfirmation;
            });
          }
        })
      });
    } else {
      notfound.textContent = "La tabla no tiene datos guardados";
    }

  });
}

const validatebtn = (event) => {

  let id = parseInt(event.target.dataset.id);

  let cantRestar = parseInt(event.target.dataset.cant);

  var cantAntes = 0;
  db.materiales.get(id, function (data) {
    let newdata = SortObj(data);
    cantAntes = newdata.cantidad || 20;

    if (id) {
      db.materiales.update(id, {
        cantidad: parseInt(cantAntes) - parseInt(cantRestar),
      }).then((updated) => {
        let pk = parseInt(event.target.dataset.pk);
        if(pk){
          db.solicitudes.update(pk, {
            estado: "V",
          }).then((u) => {
            alert("Actualizado con exito");
            table();
          })
        }

      })
    } else {
      console.log(`Please Select id: ${id}`);
    }
  });

}

const editbtn = (event) => {

  var selectListEdit = document.getElementById("solicitanteedit");
  selectListEdit.className = "form-select";

  getDataUser(db.usuarios, data => {
    var option = document.createElement("option");
    option.value = data.nombre;
    option.text = data.nombre;
    selectListEdit.appendChild(option);
  });

  //Create array of options to be added
  var selectMaterialEdit = document.getElementById("materialedit");
  var selectMaterialLiteralEdit = document.getElementById("materialliteraledit");
  selectMaterialEdit.className = "form-select";

  getDataMaterial(db.materiales, data => {
    var option = document.createElement("option");
    option.value = data.id;
    option.text = data.material;
    selectMaterialEdit.appendChild(option);

    var optionLit = document.createElement("option");
    optionLit.value = data.material;
    optionLit.text = data.material;
    selectMaterialLiteralEdit.appendChild(optionLit);
  });

  $('#modalEditSolicitudes').modal('show');

  let id = parseInt(event.target.dataset.id);
  db.solicitudes.get(id, function (data) {
    let newdata = SortObj(data);
    useridedit.value = newdata.id || 0;
    descripcionedit.value = newdata.descripcion || "";
    regionedit.value = newdata.region || "";
    solicitanteedit.value = newdata.solicitante || "";
    fechaedit.value = newdata.fecha || "";
    materialedit.value = newdata.material || "";
    materialliteraledit.value = newdata.materialliteral || "";
    cantidadedit.value = newdata.cantidad || "";
  });
}

// delete icon remove element

const deleteConfirmation = event => {
  $('#modalEliminar').modal('show');

  const btndeleteModal = document.getElementById("delete-btn");
  btndeleteModal.setAttribute(`data-id`, event.target.dataset.id);
  btndeleteModal.onclick = deletebtn;
}

const deletebtn = event => {
  var selectList = document.getElementById("solicitante");
  var selectListEdit = document.getElementById("solicitanteedit");
  removeOptions(selectList);
  removeOptions(selectListEdit);

  var selectList = document.getElementById("material");
  var selectListEdit = document.getElementById("materialedit");
  removeOptions(selectList);
  removeOptions(selectListEdit);


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
