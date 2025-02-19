import React from "react";
import Table from "react-bootstrap/Table";
import Placeholder from "react-bootstrap/Placeholder";
import { Card } from "react-bootstrap";

const SkeletonTable = () => {
  // Create an array of 6 items to match the example
  const rows = Array(6).fill(null);

  return (
    <Card>
      <Card.Body>
        <div className="h-[600px] w-full overflow-auto bg-white p-4">
          <Table>
            <tbody>
              {rows.map((_, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td>
                    <Placeholder animation="glow">
                      <Placeholder xs={4} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder animation="glow">
                      <Placeholder xs={3} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder animation="glow">
                      <Placeholder xs={5} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder animation="glow">
                      <Placeholder xs={4} />
                    </Placeholder>
                  </td>
                  <td>
                    <Placeholder animation="glow">
                      <Placeholder xs={5} />
                    </Placeholder>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SkeletonTable;
