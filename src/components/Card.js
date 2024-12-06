import React, { useState } from "react";
import { CgFileDocument } from "react-icons/cg";

export default function Card(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(props.savedItemsAll, "props.savedItemsAll");

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const isSavedItemAvailable = props.savedItemsAll.some(item => item.agentName === props.name);

  return (
    <>
      <div className="card1"  onClick={() => {
              props.setSection("chat");
              props.setChatUrl(props.url);
              props.setActiveAgent(props.agent);
              props.setMessages([]);
              props.loadSavedItems(props.name);
            }}
            style={{ cursor: "pointer" }}>
        <div className="row mx-4 my-2 border border-2 d-flex rounded p-3">
          <div
            className="col-3 d-flex justify-content-center align-items-center"
            onClick={() => {
              props.setSection("chat");
              props.setChatUrl(props.url);
              props.setActiveAgent(props.agent);
              props.setMessages([]);
            }}
            style={{ cursor: "pointer" }}
          >
            {props.image ? (
              <img
                style={{
                  borderRadius: "50%",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                  width: '50px',
                  objectFit: 'cover',
                  height: '50px'
                }}
                src={props.image}
                alt=""
              />
            ) : ''}
          </div>
          <div className="col-9">
            <div>
              <div className="cardHeader d-flex justify-content-between align-items-center">
                <h3
                  className="m-0 text-truncate"
                  style={{
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                  onClick={() => {
                    props.setSection("chat");
                    props.setChatUrl(props.url);
                    props.setActiveAgent(props.agent);
                    props.setMessages([]);
                  }}
                >
                  {truncateText(props.name, 18)}
                </h3>
                <div className="headerIcons d-flex align-items-center gap-1">
                  {/* <div>
                    <CgFileDocument size={20} />
                  </div> */}
                  <div
                    style={{
                      height: "1.3rem",
                      width: "1.3rem",
                      backgroundColor: isSavedItemAvailable ? "green" : "red",
                      borderRadius: "50%"
                    }}
                  ></div>
                </div>
              </div>
              <p
                onClick={() => {
                  props.setSection("chat");
                  props.setChatUrl(props.url);
                  props.setActiveAgent(props.agent);
                  props.setMessages([]);
                }}
                style={{
                  fontWeight: "400",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                className="mb-1 description"
              >
                {truncateText(props.description, 70)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal ${isModalOpen ? "show" : ""}`}
        style={{
          display: isModalOpen ? "block" : "none",
          zIndex: "100000",
          marginTop: "150px",
        }}
      >
        <div className="modal-dialog d-flex justify-content-center">
          <div className="modal-content" style={{ width: "70%" }}>
            <div className="modal-body">
              <p>Do you really want to delete!</p>
            </div>
            <div className="modal-footer border-top-0">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  props.handleDeleteAgent(props.id);
                  setIsModalOpen(false);
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        ></div>
      )}
    </>
  );
}
