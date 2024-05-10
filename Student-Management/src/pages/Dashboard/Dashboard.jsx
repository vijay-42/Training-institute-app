import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { RiTeamFill } from "react-icons/ri";
import { GiMoneyStack } from "react-icons/gi";
import { GiUpgrade } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";
import { FaToggleOn } from "react-icons/fa";
import { PiToggleLeftFill } from "react-icons/pi";
import "../Dashboard/Dashboard.css";

function Dashboard() {
  const [ActiveStudents, setActiveStudents] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/feescount")
      .then((response) => {
        const { balances } = response.data;
        const balanceTotal = balances.reduce(
          (acc, currentValue) => acc + parseInt(currentValue.balance),
          0
        );
        setTotalBalance(balanceTotal);

        const feeTotal = balances.reduce(
          (acc, currentValue) => acc + parseInt(currentValue.totalFees),
          0
        );
        setTotalFees(feeTotal);

        setTotalEarnings(feeTotal - balanceTotal);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/student-details/count")
      .then((response) => {
        setActiveStudents(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .get("http://localhost:5000/inActive/count")
      .then((response) => {
        setInactiveCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const active = ActiveStudents + inactiveCount;

  return (
    <>
      <div className="container-fluid py-5">
        <div className="main-container px-4 py-3 rounded">
          <p className="display-6 fw-bold ps-3 py-3 purple">Dashboard</p>
          <div className="row my-5 rs-margin1 ">
            <div
              style={{ backgroundColor: "#6A40D0" }}
              className="box  text-center p-1"
            >
              <NavLink className="Dash-link " to="/Student">
                <RiTeamFill className="display-2 mx-auto mb-3 d-block" />
                <p className="fonts d-inline fs-5">Total Student : {active}</p>
                <p className="fonts fs-5">MANAGE STUDENTS</p>
              </NavLink>
            </div>

            <div
              style={{ backgroundColor: "#168E18" }}
              className="box text-center p-1"
            >
              <NavLink className="Dash-link" to="/Fees_Section">
                <GiMoneyStack className="display-2 mx-auto mb-3 d-block" />
                <p className="fonts d-inline fs-5">
                  Total Earnings: Rs.{totalEarnings}
                </p>
                <p className="fonts fs-5">COLLECT FEES</p>
              </NavLink>
            </div>

            <div className="bg-danger box text-center p-1">
              <NavLink className="Dash-link" to="/Report_Section">
                <GiUpgrade className="display-2 mx-auto mb-3 d-block" />
                <p className="fonts d-inline fs-5">
                  Total Pending: Rs:{totalBalance}
                </p>
                <p className="fonts fs-5">COLLECT FEES</p>
              </NavLink>
            </div>

            <div
              style={{ backgroundColor: "#8F8F2C" }}
              className="box text-center p-1"
            >
              <NavLink className="Dash-link" to="/Student">
                <FaToggleOn className="display-2 mx-auto mb-4 d-block" />
                <p className="fonts fs-5">ACTIVE STUDENTS: {ActiveStudents}</p>
              </NavLink>
            </div>

            <div className="bg-dark box text-center p-1">
              <NavLink className="Dash-link" to="/Report_Section">
                <TbReportAnalytics className="display-2 mx-auto mb-4 d-block" />
                <p className="fonts d-inline fs-5">VIEW REPORTS</p>
              </NavLink>
            </div>

            <div
              style={{ backgroundColor: "#CA8012" }}
              className="box text-center p-1"
            >
              <NavLink className="Dash-link" to="/In_active_Student">
                <PiToggleLeftFill className="display-2 mx-auto mb-4 d-block" />
                <p className="fonts d-inline fs-5">
                  IN-ACTIVE STUDENTS: {inactiveCount}
                </p>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
