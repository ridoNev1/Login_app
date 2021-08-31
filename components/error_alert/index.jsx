import React from "react";

const Eror = (message) => {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffc7ca",
        padding: "8px 12px",
        borderRadius: 2,
        marginBottom: 10,
        border: "2px solid red",
      }}
    >
      <p
        style={{ color: "red", fontSize: 13 }}
        // className="line-overflowing-text"
      >
        {message}
      </p>
    </div>
  );
};

export default Eror;
