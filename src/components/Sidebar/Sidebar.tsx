import { useCallback, useEffect, useRef, useState } from "react";
import "./Sidebar.css";
import { Customer } from "../../types/Customer";
import axios from "axios";
import { toast } from "react-toastify";
import { ListResponse } from "../../types/Response";
const Sidebar = ({
  activeCustomerId,
  setActiveCustomerId,
}: {
  activeCustomerId: string;
  setActiveCustomerId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [customers, setCustomers] = useState<Array<Customer>>([]);
  const [hasMore,setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const elementRef = useRef(null);

  useEffect(() => {
    if(hasMore) {
      fetchCustomers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get<ListResponse<Customer>>(
        process.env.REACT_APP_BACKEND_URL+`/api/user?page=${pageNo}`
      );
      if(customers.length+response.data.result.items.length>= response.data.result.total){
        setHasMore(false);
      }
      setCustomers((prev) => [...prev, ...response.data.result.items]);
      if(!activeCustomerId){
        setActiveCustomerId(prev=>prev || response.data.result.items[0].id)
      }
    } catch (error) {
      setHasMore(false);
      toast.error("Failed to fetch customers");
    } 
  };

  const onIntersection = useCallback((entries:IntersectionObserverEntry[])=> {
    const firstEntry = entries[0];
    if(firstEntry.isIntersecting && hasMore){
      setPageNo(prev=>prev+1);
    }
  },[hasMore,setPageNo])

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersection);
    if(observer && elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if(observer){
        observer.disconnect();
      }
    }
  }, [onIntersection,customers]);

  return (
    <div className="customers-container">
      <div className="cards-container">
        {
          customers.map((customer) => {
            return (
              <div
                onClick={() => {
                  setActiveCustomerId(customer.id);
                }}
                key={customer.id}
                className={
                  activeCustomerId === customer.id
                    ? "customer-card-div active"
                    : "customer-card-div"
                }
              >
                <div className="card-details">
                  <p className="customer-name">{customer.name}</p>
                  <p className="customer-bio">{customer.bio}</p>
                </div>
              </div>
            );
          })
        }
        {hasMore && <div ref={elementRef} className="loader"></div>}
      </div>
    </div>
  );
};

export default Sidebar;
