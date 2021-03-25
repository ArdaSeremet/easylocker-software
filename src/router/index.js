import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LeaveWithoutRegistration from '../views/LeaveWithoutRegistration.vue'
import MakeReservation from '../views/MakeReservation.vue'
import GetWithoutRegistration from '../views/GetWithoutRegistration.vue'
import RegisterWithRFID from '../views/RegisterWithRFID.vue'
import LeaveToRFIDUser from '../views/LeaveToRFIDUser.vue'
import GetWithRFID from '../views/GetWithRFID.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/leave',
    name: 'Leave',
    component: LeaveWithoutRegistration
  },
  {
    path: '/get',
    name: 'Get',
    component: GetWithoutRegistration
  },
  {
    path: '/make-reservation',
    name: 'MakeReservation',
    component: MakeReservation
  },
  {
    path: '/leave/drawer-size',
    name: 'Leave/DrawerSize',
    component: () => import('../components/LeaveWithoutReservation/DrawerSize.vue')
  },
  {
    path: '/leave/name',
    name: 'Leave/Name',
    component: () => import('../components/LeaveWithoutReservation/Name.vue')
  },
  {
    path: '/leave/email',
    name: 'Leave/Email',
    component: () => import('../components/LeaveWithoutReservation/Email.vue')
  },
  {
    path: '/leave/own-email',
    name: 'Leave/OwnEmail',
    component: () => import('../components/LeaveWithoutReservation/OwnEmail.vue')
  },
  {
    path: '/leave/final',
    name: 'Leave/Final',
    component: () => import('../components/LeaveWithoutReservation/Final.vue')
  },
  {
    path: '/register-rfid',
    name: 'RegisterRFID/RFID',
    component: RegisterWithRFID
  },
  {
    path: '/register-rfid/username',
    name: 'RegisterRFID/Username',
    component: () => import('../components/RegisterWithRFID/Username.vue')
  },
  {
    path: '/leave-rfid',
    name: 'LeaveToRFID/Username',
    component: LeaveToRFIDUser
  },
  {
    path: '/leave-rfid/drawer-size',
    name: 'LeaveToRFID/DrawerSize',
    component: () => import('../components/LeaveToRFIDUser/DrawerSize.vue')
  },
  {
    path: '/get-rfid',
    name: 'GetWithRFID',
    component: GetWithRFID
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
