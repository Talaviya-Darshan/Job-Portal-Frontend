import React  from "react";
export default function MassageModal({ closeModal }) {
  
  return (
    <div className="modal-dialog modal-xl">
      <div className="modal-content">
        <div className="modal-body p-0">
          <div className="card direct-chat direct-chat-primary">

            {/* Header */}
            <div className="card-header">
              <h3 className="card-title">
                chat
              </h3>
              <div className="card-tools">
                <button className="btn btn-tool" onClick={closeModal}>
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>            
          </div>
        </div>
      </div>
    </div>
  );
}
