import React from "react";

export default function ConfirmExample() {
  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (confirmed) {
      alert("Deleted!");
      // your delete logic here
    } else {
      alert("Canceled!");
    }
  };

  return (
    <div>
      <h2>Confirm Popup Example</h2>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
