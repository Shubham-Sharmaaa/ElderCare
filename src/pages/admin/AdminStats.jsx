import React, { useEffect, useState } from "react";
import { apiHospital, apiAdmin } from "../../lib/fakeApi";

export default function AdminStats() {
  const [hospital, sethosp] = useState([]);
  useEffect(() => {
    let alive = true;
    async function fetchhosp() {
      try {
        const res = await apiHospital.list();
        if (alive) sethosp(res || []);
      } catch (e) {
        if (alive) sethosp([]);
        return;
      }
    }
    fetchhosp();
    return () => {
      alive = false;
    };
  }, []);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await apiAdmin.listNri();
        console.log("user:  ", user);
        if (user) setUsers(user);
        return;
      } catch (e) {
        console.log(e);
        return;
      }
    }
    fetchUser();
  }, []);
  const [totalDoctors, setTotalDoctors] = useState([]);
  useEffect(() => {
    async function fetchdoctor() {
      try {
        const doc = await apiAdmin.listDoctors();
        console.log("doc:  ", doc);
        if (doc) setTotalDoctors(doc);
        return;
      } catch (e) {
        console.log(e);
        return;
      }
    }
    fetchdoctor();
  }, []);
  const [totaluser, setTotalUser] = useState([]);
  useEffect(() => {
    async function fetchtotal() {
      try {
        const res = await apiAdmin.listUsers();
        if (res) setTotalUser(res);
        return;
      } catch (e) {
        console.log(e);
        return;
      }
    }
    fetchtotal();
  }, []);

  return (
    <div className="grid two">
      <div className="card pad">
        <div className="kpi">{hospital && hospital.length}</div>
        <div>Hospitals</div>
      </div>
      <div className="card pad">
        <div className="kpi">{totalDoctors.length}</div>
        <div>Doctors</div>
      </div>
      <div className="card pad">
        <div className="kpi">{users.length}</div>
        <div>NRI Users</div>
      </div>
      <div className="card pad">
        <div className="kpi">{totaluser.length}</div>
        <div>Total Accounts</div>
      </div>
    </div>
  );
}
