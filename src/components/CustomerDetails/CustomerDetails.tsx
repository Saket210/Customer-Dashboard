import { useEffect, useState } from "react";
import "./CustomerDetails.css";
import { Customer } from "../../types/Customer";
import axios from "axios";
import { Response } from "../../types/Response";
import { toast } from "react-toastify";

const randomImageIds = () => {
  const imageIds = [];
  for (let i = 0; i < 9; i++) {
    imageIds.push(Math.floor(Math.random() * 999) + 1);
  }
  return imageIds;
};
const CustomerDetails = ({
  activeCustomerId,
}: {
  activeCustomerId: string;
}) => {
  const [customer, setCustomer] = useState<Customer>();
  const [imageIds, setImageIds] = useState<number[]>(randomImageIds());
  const [fade, setFade] = useState<string>("fade-in");

  useEffect(() => {
    setFade("fade-out");

    const interval = setTimeout(() => {
      setImageIds(randomImageIds());
    }, 10000);

    const fadeInInterval = setTimeout(() => {
      setFade("fade-in");
    }, 500);

    return () => {
      clearTimeout(interval);
      clearTimeout(fadeInInterval);
    };
  }, [imageIds]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!activeCustomerId) {
          return;
        }
        const response = await axios.get<Response<Customer>>(
          process.env.REACT_APP_BACKEND_URL+`/api/user/${activeCustomerId}`
        );
        setImageIds(randomImageIds());
        setCustomer(response.data.result);
      } catch (error) {
        toast.error("Failed to fetch user profile");
      }
    };
    fetchUsers();
  }, [activeCustomerId]);

  return (
    <div className="profile-container">
      <div className="profile-details-container">
        <h2>{customer?.name}</h2>
        <h5>Address: {customer?.address}</h5>
        <p>{customer?.bio}</p>
        <div className="images-div">
          {imageIds.map((imageId, index) => {
            return (
              <img
                className={`image ${fade}`}
                width={200}
                height={200}
                key={index}
                src={`https://picsum.photos/id/${imageId}/200/200`}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = "https://picsum.photos/id/1/200/200";
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
