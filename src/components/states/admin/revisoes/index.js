import { h, Component } from 'preact';
import * as reqwest from 'reqwest';
import * as moment from 'moment';
import {LesTable, LesTableColumn, LesTableQueryOpt, LesTableButton} from '../../../les_table';
import { Link } from 'preact-router/match';
import { Popover } from 'element-react';
import 'element-theme-default';
import root from 'window-or-global';

export default class AdminRevisoes extends Component {
  constructor(props){
    super(props);
    this.setState({
      auth: props.auth, 
      url: root.url_base+'/api/admin/revisoes'
      

    })
  }
  formatRevisor(x, item){
    return (<Link href={"/admin/revisor/"+item.revisor_id}>
              <span> {x} </span>
            </Link>)

  }
  formatAutor(x, item){
    return (<Link href={"/admin/estudante/"+item.autor_id}>
              <span> {x} </span>
            </Link>)

  }
  formatStatus(x){
    switch(x) {
      case "Pendente":
        return (<span class="tag is-warning">{x}</span>);
      case "Aprovado":
        return (<span class="tag is-success">{x}</span>);
      case "Em Revisão":
        return (<span class="tag is-info">{x}</span>);
      case "Recusado":
        return (<span class="tag is-danger">{x}</span>);
      default:
        return x;
    }

  }
  formatData(x){
    let m = moment(x, "D/M/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
    let m0 = m == "Invalid date" ? " - " : m;
    return (<small> {m0}</small>);

  }
  formatPopoverRevisor(x,item){
  let nt = ( <div>
        <b> Revisões: {item.revisoes ? item.revisoes : "Nenhuma" } </ b>  <br />
        <b> Entrou: {this.formatData(item.entrou)} </ b>  <br />
      </div>) 
  return (<Popover placement="top-start" width="200" trigger="hover" content={nt}>
      <span>{this.formatRevisor(x, item)}</span>
    </Popover>)
   }
   formatPopoverAutor(x,item){
      let serie = parseInt(item.autor_serie);
      let ano_atual = new Date();
      ano_atual = ano_atual.getUTCFullYear();
      console.log(serie);
      if(typeof serie != NaN){
          serie = ano_atual - serie + 1;
      }else{
        serie = "";
      }
      let nt = ( <div>
          <b> Escola: </ b> {item.autor_escola} <br />
          <b> Turma: </ b> {item.autor_turma} <br />
          <b> Ano: </ b> {item.autor_serie} ({serie}º Ano) <br />
        </div>) 
      return (<Popover placement="top-start" width="200" trigger="hover" content={nt}>
          <span>{this.formatAutor(x, item)}</span>
        </Popover>)
   }
  componentWillReceiveProps(props) { ///////////// QUANDO O COMPONENTE FOR MONTADO
    this.setState({auth: props.auth})
  }
  render() {
    return (
        <div class="container"> 
            <h1 class="is-size-3">Todas as Revisões </h1>
            <LesTable auth={this.state.auth}  columns={this.state.columns} url={this.state.url} >
              <LesTableColumn type="column" column="id" label="Id" />
              <LesTableColumn type="column" column="revisor" label="Revisor" apply={this.formatPopoverRevisor.bind(this)} />
              <LesTableColumn type="column" column="autor" label="Autor" apply={this.formatPopoverAutor.bind(this)}/>
              <LesTableColumn type="column" column="tema" label="Tema" />
              <LesTableColumn type="column" column="status" label="Status" apply={this.formatStatus}>
                <LesTableQueryOpt type="filter" label="Pendente" value="Pendente" />
                <LesTableQueryOpt type="filter" label="Aprovado" value="Aprovado" />
                <LesTableQueryOpt type="filter" label="Em Revisão" value="Em Revisão" />
                <LesTableQueryOpt type="filter" label="Recusado" value="Recusado" />
              </LesTableColumn>
              <LesTableColumn type="column" column="data" label="Enviado" apply={this.formatData} search_type={"date"}/>
              <LesTableColumn type="column" column="nota" label="Nota" />
            </LesTable>
        </div>
    );
  }
}
