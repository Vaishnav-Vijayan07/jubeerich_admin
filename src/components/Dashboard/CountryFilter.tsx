import React, { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

type Props = {
  countries: Countries;
  onCountryChange: (id: any) => void;
  currentCountry : number
};
type CountryItem = {
  id: number;
  country_name: string;
};

type Countries = CountryItem[];

function CountryFilter({ countries, onCountryChange,currentCountry }: Props) {
  

  const handleCountryClick = (id: any) => {
    onCountryChange(id);
  };

  return (
    <Row>
      <Col md={3}>
        <Form.Group className="mb-3" controlId="country">
          <Form.Label>Country</Form.Label>
          <Form.Select onChange={(e) => handleCountryClick(e.target.value)} value={currentCountry}>
            <option value="">Select Country</option>
            {countries?.map((item: CountryItem) => (
              <option value={item?.id} key={item?.id} >
                {item?.country_name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
}

export default CountryFilter;
