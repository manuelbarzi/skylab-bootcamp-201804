import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom'
import { Button, Popover, PopoverHeader, Alert } from 'reactstrap';
import logic from "../../logic"
import './style.scss';
import {ModalApp} from '../'


class Notifications extends Component {


  state = {
    popoverOpen: false,
    notifications:this.props.notifications
  }


  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }


  handlerAcceptFriendship = (idFriend) => {

    logic.acceptFriendship(localStorage.getItem("id-app"), idFriend)
        .then(res => {
            logic.sendNotifactionRelationship(idFriend, localStorage.getItem("id-app"), 'acceptFriendship:')
                .then((res) => {
                    this.clearNotifications()
                })
        }).catch(e=>{
          this.toggleModal("Error",e)
        })
}



handlerIgnoreFriendship = () => {
  this.clearNotifications()
}


clearNotifications = () => {
  logic.deleteNotifications()
      .then((res) => {
        // this.toggleModal("Success","Congratulations! correctly sent request")
        this.props.clearNotifications()
      })
}




  drawNotifications = ()=>{
    
    return this.props.notifications.map((n, key)=>{

      if(n.type ==="#friendship")
      return(<Alert key={"alert_n"+key} color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
          {`${n.user} ${n.notification}`}
                <Button tag={Link} to={`/user/${n.id}`}   onClick={()=>{this.handlerAcceptFriendship(n.id)}} color="primary">
                  <i className="fas fa-check-circle fa-2x"></i>
                </Button>
                <Button onClick={()=>{this.handlerIgnoreFriendship()}}  color="danger">
                  <i className="fas fa-times-circle fa-2x"></i>
                </Button>
            </Alert>)

      else return (<Alert key={"alert_n"+key} color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
                    {`${n.user} ${n.notification}`}
                  </Alert>)
    })    
  }


  toggleModal=(titleModal,msgModal,redirect)=> {

    if(!titleModal || !msgModal) titleModal = msgModal = ""

    this.setState({
        activateModal: !this.state.activateModal,
        titleModal,
        msgModal:msgModal.toString(),
        redirect
    })
  }

  modalRedirect=(route)=>{
    this.props.history.push(route)
}


  render() {

    

    let notification ="without-notification"
    if(this.props.notifications.length>0) notification="one-notification"

    return (
      <div>
        <Button  color="link"  id="Popover1" onClick={this.toggle}>
        <i className={"fas fa-bell fa-1x "+notification}></i>
        </Button>

        <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
            {this.drawNotifications()}
            {(this.props.notifications.length>0) ?
            <PopoverHeader onClick={this.clearNotifications}  className="text-center">Clear Notifications</PopoverHeader>
            : <PopoverHeader  className="text-center">Without  Notifications</PopoverHeader>}
        </Popover>
        <ModalApp headerMsg={this.state.titleModal} bodyMsg={this.state.msgModal} redirectState={this.state.redirect} modalRedirect={this.modalRedirect} toggle={this.toggleModal} activate={this.state.activateModal}/>
      </div>
    )
  }
}

export default withRouter(Notifications)