import logo from './logo.svg';
import './App.css';
/*Libresias externas */
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Component } from 'react';

const baseUrl = "https://apex.oracle.com/pls/apex/xxtesji/person/";

class App extends Component {
  
  state={
      dataPersons:[], // eSTADO QUE ALMACENA LOS DATOS DE LA PERSONA
      formInsertar: false, //Estado que se ocupa para mostrar el formulario que inserta 
      forms:{
          id: '',
          nombre: '',
          apellido: '',
          telefono: '',
          correo: '',
          direccion: ''
     }
  }
 
  /**oBTIENE LOS DATOS DE LA PERSONA CON EL SERVIOCIO GET
   * OCUPAMOS AXIOS PARA CONSUMIRLO Y LO ASIGNAMOS A 
   * NUESTRO ESTADO DONDE ALMACENAMOS LOS DATOS DE LA PERSONA
   */
  obtenerContactos=()=>{
    axios.get(baseUrl+'get_all_persons' ).then(response => {
       this.setState({dataPersons :response.data.items});
       
    }).catch(error=>{
      console.log(error.message);
    });
  }

  /**Metodo que consume el servicio que hace el insert en la agenda
   * Creamos el cuerpo de la peticion cerramos el modal y 
   * actualizamos los datos de la agenda
   */
  insertarPersona=async()=>{

      /**Estructura del cuerpo que recibe el servicio */
      const body =  {
          //datos que se enviaran
          V_FIRST_NAME: this.state.forms.nombre,
          V_LAST_NAME:  this.state.forms.apellido,
          V_PHONE_NUMBER:  this.state.forms.telefono,
          V_TYPE_PHONE: "PERSONAL",
          V_EMAIL: this.state.forms.correo,
          V_TYPE_EMAIL: "PERSONAL",
          V_ADDRES: this.state.forms.direccion
      } 

  await  axios.post(baseUrl+'/create_contact_agent', body ).then(response=>{
      this.showModalInsertar();
      this.obtenerContactos();
      console.log(response.data);
    }).catch(error=>{
      console.log(error.message);
    });

  }

  /**Metodo que muestra el formulario de insertar */
  showModalInsertar=()=>{
    this.setState({formInsertar : !this.state.formInsertar}); 
  }

  /**Detecta los cambios en el formulario de agregar y/o editar
   * Como este metodo se ejecuta en segundo plano es un metodo asyncrono
   */
  handleChange=async e=>{ 
    e.persist();
    await this.setState({
      forms:{
        ...this.state.forms,
        [e.target.name] : e.target.value
      }
    });
    console.log(this.state.forms);
  }

  componentDidMount(){
    this.obtenerContactos();
  }

  render(){
    const {forms}= this.state;
    //const forms = this.state.forms;
    return (
      <div className="App">
       <br /><br /><br />
         <button className="btn btn-success" 
                 onClick={()=>this.showModalInsertar()}
          >
          Agregar Contacto</button>

      <br /><br />
      <table className="table ">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>Correo</th>
            <th>Direccion</th>
            <th>Acciones</th>
          </tr>
        </thead>
       <tbody>
          {this.state.dataPersons.map(persona=>{
              return(
                <tr>
                  <td>{persona.person_id}</td>
                  <td>{persona.nombre}</td>
                  <td>{persona.direccion}</td>
                  <td>{persona.direccion}</td> 
                  <td>{persona.direccion}</td> 
                  <td>
                      <button className="btn btn-primary">Editar</button>
                      {"   "}
                      <button className="btn btn-danger">Eliminar</button>
                </td>
                </tr>
              )
            })}                    
      </tbody>
      </table>
      
    
      <Modal isOpen={this.state.formInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.showModalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={forms.id}/>
                    <br />
                    <label htmlFor="nombre">Nombre</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange}  value={forms.nombre}/> 
                    <br/>
                    <label htmlFor="nombre">Apellido</label>
                    <input className="form-control" type="text" name="apellido" id="apellido" onChange={this.handleChange}  value={forms.apellido}/> 
                    <br/>
                    <label htmlFor="nombre">Correo</label>
                    <input className="form-control" type="mail" name="correo" id="correo" onChange={this.handleChange}  value={forms.correo}/>
                    <br />
                    <label htmlFor="capital_bursatil">Telefono</label>
                    <input className="form-control" type="number" name="telefono" id="telefono" onChange={this.handleChange}  value={forms.telefono}/>
                    <br />
                    <label htmlFor="nombre">Dirección</label>
                    <input className="form-control" type="text" name="direccion" id="direccion"  onChange={this.handleChange}  value={forms.direccion}/> 
                  </div>
                </ModalBody>
                
                <ModalFooter>
                 
                      <button className="btn btn-success" onClick={()=>this.insertarPersona()}>
                      Insertar
                      </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                      Actualizar
                      </button>
                   
                    <button className="btn btn-danger" onClick={()=>this.showModalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>
      </div>
    );
  }
}

export default App;
