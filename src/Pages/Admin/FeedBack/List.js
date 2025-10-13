import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import DataTable from "react-data-table-component";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContentHeader from "../../../components/ContentHeader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LiaStarSolid, LiaStarHalfAltSolid } from "react-icons/lia";

export default function Inbox() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}feedback/get`, {
        headers: {
          Authorization: `${token}`,
          "Cache-Control": "no-cache",
        },
      });
      setLoading(false);
      const data = response.data || [];
      setRecords(data);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
    }
  };

  const columns = [
    {
      name: "No",
      selector: (row, index) =>
        row.isSkeleton ? <Skeleton width={20} /> : index + 1,
      width: "60px",
      center: "true",
    },
    
    {
      name: "Name",
      sortable: true,
      cell: (row) =>
        row.isSkeleton ? <Skeleton width={120} /> : `${row.name}`,
    },
    {
      name: "Email",
      sortable: true,
      cell: (row) =>
        row.isSkeleton ? <Skeleton width={120} /> : `${row.email}`,
    },

    {
      name: "Message  ",
      sortable: true,
      cell: (row) => (row.isSkeleton ? <Skeleton width={100} /> : row.message),
    },
    {
      name: "Ratings",
      width: "150px",
      sortable: true,
      cell: (row) =>
        row.isSkeleton ? (
          <Skeleton width={80} />
        ) : (
          <div>
            {[...Array(5)].map((_, i) => {
              const full = i + 1 <= row.rating;
              const half = !full && i + 0.5 <= row.rating;

              return full ? (
                <LiaStarSolid
                  key={i}
                  className="text-warning"
                  style={{ fontSize: "20px" }}
                />
              ) : half ? (
                <LiaStarHalfAltSolid
                  key={i}
                  className="text-warning"
                  style={{ fontSize: "20px" }}
                />
              ) : (
                ""
              );
            })}
          </div>
        ),
    },
  ];

  const filteredRecords = records.filter(
    (record) =>
      `${record.firstName} ${record.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      record.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.instituteName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Skeleton rows
  const skeletonData = Array(8)
    .fill({})
    .map((_, index) => ({
      _id: index,
      isSkeleton: true,
    }));

  return (
    <Layout ac8="active">
      <ContentHeader
        title="Feedback"
        breadcrumbs={[
          { label: "Dashboard", to: "/admin/dashboard" },
          { label: "Feedback" },
        ]}
      />
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <div className="d-flex justify-content-between">
                    <div className="bd-highlight">
                      <input
                        className="form-control"
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                        title="Search within table"
                      />
                    </div>
                  </div>
                </div>
                <div className="card-body text-center p-2">
                  {loading ? (
                    <DataTable
                      columns={columns}
                      data={skeletonData}
                      pagination={false}
                      className="custom-table"
                      noHeader
                      highlightOnHover
                      striped
                      customStyles={{
                        headCells: {
                          style: {
                            justifyContent: "center",
                          },
                        },
                      }}
                    />
                  ) : (
                    <DataTable
                      columns={columns}
                      data={filteredRecords}
                      pagination
                      className="custom-table"
                      noDataComponent="No data available"
                      highlightOnHover
                      striped
                      customStyles={{
                        headCells: {
                          style: {
                            justifyContent: "center",
                          },
                        },
                      }}
                      pointerOnHover
                      responsive
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer style={{ width: "auto" }} />
    </Layout>
  );
}
