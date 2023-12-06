import { useThree, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Environment } from "@react-three/drei";
import { useEffect } from "react";

function Scene() {
  const { scene, setSize, camera } = useThree();
  const bgTexture = useLoader(TextureLoader, "/bg_grid.png");
  // bgTexture.encoding = THREE.sRGBEncoding;
  scene.background = bgTexture;

  camera.lookAt(scene.position);
  //   camera.updateMatrix();

  // setSize(window.innerWidth, window.innerHeight);

  useEffect(() => {
    // Canvas
    const nodeRef = document.querySelector(".sometest");
    if (nodeRef) {
      const width = nodeRef?.clientWidth;
      const height = nodeRef?.clientHeight;
      setSize(width, height);

      const onResizeHandler = () => {
        const width = nodeRef?.clientWidth;
        const height = nodeRef?.clientHeight;
        setSize(width, height);
      };

      nodeRef.addEventListener("resize", onResizeHandler);

      return () => {
        nodeRef.removeEventListener("resize", onResizeHandler);
      };
    }
  }, [setSize]);

  return (
    <>
      <Environment files="/winter_lake_01_1k.hdr" />
      <ambientLight color={0xffffff} intensity={0.3} />
      <directionalLight position={[1, 0, 1]} color={0xffffff} intensity={0.2} />
    </>
  );
}

export default Scene;
