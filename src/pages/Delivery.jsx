import React, { useState, useLayoutEffect } from "react";
import Container from "react-bootstrap/Container";
import Loader from "../components/utils/Loader";
import { getDocument } from "../services/document";

const Contact = () => {
  const [document, setDocument] = useState({ loading: true, data: false });

  useLayoutEffect(() => {
    getDocument("delivery")
      .then((res) => setDocument({ loading: false, data: res }))
      .catch(() => setDocument((data) => ({ ...data, loading: false })));
  }, []);

  if (document?.loading) {
    return <Loader full />;
  }

  return (
    <main>
      <section className="sec-7 mb-5">
        <Container>
          {document?.data?.content && (
            <div dangerouslySetInnerHTML={{ __html: document.data.content }} />
          )}
        </Container>
      </section>
    </main>
  );
};

export default Contact;
