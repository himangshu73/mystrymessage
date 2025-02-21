"use client";

import { toast } from "sonner";

const Home = () => {
  return (
    <div>
      <button onClick={() => toast("My first toast")}>Give me a toast</button>
    </div>
  );
};

export default Home;
