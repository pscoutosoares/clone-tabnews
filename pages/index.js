import { useEffect, useState } from "react";
import Image from "next/image";
function Home() {
  const [image, setImage] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const query = await fetch("https://api.thedogapi.com/v1/images/search");
      const response = await query.json();
      setImage(response[0]);
    };
    getData();
  }, []);

  return (
    <div>
      <h1>Doguito aleatório</h1>
      {image && <Image src={image.url} width={image.width} alt="" />}
    </div>
  );
}

export default Home;
