import SeoHead from "./components/SeoHead";
import Layout from "./components/Layout/Layout";
import Feature from "./components/Feature";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";

import { NextPage } from "next";
import React from "react";


const Home: NextPage = () => {

  return (
    <>
      <SeoHead title="LaslesVPN Landing Page"/>
      <Layout>
        <Hero/>
        <Feature/>
        <Pricing/>
      </Layout>
    </>
  );
};
export default Home;
