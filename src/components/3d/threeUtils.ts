import * as THREE from 'three';
import { ModelType } from '../../types';

// Generate procedural fabric bump/normal maps for hyper-realistic cloth weaves
export function createFabricTexture(type: 'solid' | 'pinstripe' | 'herringbone' | 'glen-plaid' | 'velvet-matte'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  if (type === 'herringbone') {
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1.5;
    const step = 16;
    for (let x = 0; x < 512; x += step * 2) {
      for (let y = 0; y < 512; y += step) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + step, y + step);
        ctx.lineTo(x + step * 2, y);
        ctx.stroke();
      }
    }
  } else if (type === 'pinstripe') {
    ctx.strokeStyle = '#aaaaaa';
    ctx.lineWidth = 1.2;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
  } else if (type === 'velvet-matte') {
    // Noise micro texture
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.min(255, Math.max(0, 128 + noise));
      data[i + 1] = Math.min(255, Math.max(0, 128 + noise));
      data[i + 2] = Math.min(255, Math.max(0, 128 + noise));
      data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  } else {
    // Default high-count worsted twill diagonal ribbing
    ctx.strokeStyle = '#909090';
    ctx.lineWidth = 1;
    for (let i = -512; i < 1024; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 512, 512);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

// Build a sculpted procedural luxury formal suit mannequin
export interface SuitMeshComponents {
  rootGroup: THREE.Group;
  jacketGroup: THREE.Group;
  lapelMeshes: THREE.Mesh[];
  jacketMeshes: THREE.Mesh[];
  buttonMeshes: THREE.Mesh[];
  shirtMeshes: THREE.Mesh[];
  tieMesh: THREE.Mesh | null;
  trouserMeshes: THREE.Mesh[];
  pocketSquareMesh: THREE.Mesh | null;
  vestMeshes: THREE.Mesh[];
  cufflinksMeshes: THREE.Mesh[];
  clothSimulationMesh?: THREE.Mesh;
}

export function buildProceduralSuitModel(options: {
  suitColorHex: string;
  secondaryHex?: string;
  roughness: number;
  metalness: number;
  fabricPattern: 'solid' | 'pinstripe' | 'herringbone' | 'glen-plaid' | 'velvet-matte';
  modelType: ModelType;
  includeClothSimulation?: boolean;
}): SuitMeshComponents {
  const root = new THREE.Group();
  root.name = 'LuxurySuitMannequin';

  const fabricTex = createFabricTexture(options.fabricPattern);

  // Model type flags
  const isTuxedo = options.modelType === 'tuxedo';
  const isBandhgala = options.modelType === 'bandhgala';
  const isThreePiece = options.modelType === 'three_piece';
  const isBlazer = options.modelType === 'blazer';
  const isTrouser = options.modelType === 'trouser';
  const isShirt = options.modelType === 'shirt';
  const isWaistcoat = options.modelType === 'waistcoat';
  const isAccessory = options.modelType === 'accessory';

  // Base Materials
  const suitMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(options.suitColorHex),
    roughness: options.roughness,
    metalness: options.metalness,
    bumpMap: fabricTex,
    bumpScale: 0.008,
  });

  const lapelMaterial = new THREE.MeshStandardMaterial({
    color: isTuxedo ? new THREE.Color('#0f0f13') : new THREE.Color(options.suitColorHex),
    roughness: isTuxedo ? 0.25 : options.roughness * 0.95,
    metalness: isTuxedo ? 0.28 : options.metalness,
    bumpMap: fabricTex,
    bumpScale: 0.004,
  });

  const buttonMaterial = new THREE.MeshStandardMaterial({
    color: isBandhgala ? new THREE.Color('#d4af37') : isTuxedo ? new THREE.Color('#151515') : new THREE.Color('#222226'),
    roughness: 0.2,
    metalness: isBandhgala ? 0.85 : 0.4,
  });

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(isShirt ? options.suitColorHex : '#fcfcfc'),
    roughness: 0.45,
    metalness: 0.02,
    bumpMap: fabricTex,
    bumpScale: 0.005,
  });

  const tieColor = isTuxedo 
    ? new THREE.Color('#0a0a0d') 
    : isBandhgala 
      ? new THREE.Color('#a31d1d') 
      : new THREE.Color(options.secondaryHex || '#0064E0');

  const tieMaterial = new THREE.MeshStandardMaterial({
    color: tieColor,
    roughness: 0.3,
    metalness: 0.15,
  });

  const pocketSquareMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(isTuxedo ? '#ffffff' : '#00D2FF'),
    roughness: 0.25,
    metalness: 0.1,
  });

  const trouserColor = (isBlazer || isShirt || isWaistcoat)
    ? new THREE.Color('#141721')
    : new THREE.Color(options.suitColorHex);

  const trouserMaterial = new THREE.MeshStandardMaterial({
    color: trouserColor,
    roughness: options.roughness,
    metalness: options.metalness,
    bumpMap: fabricTex,
    bumpScale: 0.008,
  });

  const jacketGroup = new THREE.Group();
  root.add(jacketGroup);

  const lapelMeshes: THREE.Mesh[] = [];
  const jacketMeshes: THREE.Mesh[] = [];
  const buttonMeshes: THREE.Mesh[] = [];
  const shirtMeshes: THREE.Mesh[] = [];
  const trouserMeshes: THREE.Mesh[] = [];
  const vestMeshes: THREE.Mesh[] = [];
  const cufflinksMeshes: THREE.Mesh[] = [];
  let tieMesh: THREE.Mesh | null = null;
  let pocketSquareMesh: THREE.Mesh | null = null;

  // 1. Mannequin Pedestal / Floating Platform
  const pedestalGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.08, 48);
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#10141f'),
    roughness: 0.2,
    metalness: 0.8,
  });
  const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
  pedestal.position.y = -1.95;
  pedestal.receiveShadow = true;
  root.add(pedestal);

  // Meta Blue Glowing Ring on Pedestal
  const ringGeo = new THREE.TorusGeometry(0.88, 0.02, 16, 64);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x0064E0 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -1.91;
  root.add(ring);

  // Support Pole
  const poleGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.1, 24);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x242834, metalness: 0.9, roughness: 0.2 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.set(0, -0.9, 0);
  root.add(pole);

  // -------------------------------------------------------------
  // ACCESSORY SPECIALIZED DISPLAY (Sartorial Tie, Square, Cufflinks)
  // -------------------------------------------------------------
  if (isAccessory) {
    const plinthGeo = new THREE.BoxGeometry(0.9, 0.45, 0.7);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#121622'),
      metalness: 0.85,
      roughness: 0.25,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.set(0, 0.2, 0);
    root.add(plinth);

    // Folded Silk Necktie
    const tieRollGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.18, 32);
    const tieRoll = new THREE.Mesh(tieRollGeo, tieMaterial);
    tieRoll.rotation.x = Math.PI / 2;
    tieRoll.position.set(-0.22, 0.52, 0.05);
    root.add(tieRoll);

    const tieCascadeGeo = new THREE.BoxGeometry(0.12, 0.5, 0.02);
    const tieCascade = new THREE.Mesh(tieCascadeGeo, tieMaterial);
    tieCascade.position.set(-0.22, 0.22, 0.18);
    tieCascade.rotation.x = -0.2;
    root.add(tieCascade);
    tieMesh = tieCascade;

    // Silk Pocket Square origami arrangement
    const squareP1 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.16, 4), pocketSquareMaterial);
    squareP1.position.set(0.18, 0.54, -0.05);
    squareP1.rotation.set(0.1, Math.PI / 4, 0.15);
    const squareP2 = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 4), pocketSquareMaterial);
    squareP2.position.set(0.24, 0.52, 0.02);
    squareP2.rotation.set(-0.1, Math.PI / 3, -0.1);
    root.add(squareP1, squareP2);
    pocketSquareMesh = squareP1;

    // Cufflinks pair on presentation pad
    const cuffGoldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.1 });
    const cuffOnyxMat = new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.2, roughness: 0.05 });
    
    [-0.04, 0.04].forEach((xOff, idx) => {
      const cuffBase = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.015, 24), cuffGoldMat);
      cuffBase.position.set(xOff, 0.44, 0.18);
      const cuffStone = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.016, 24), cuffOnyxMat);
      cuffStone.position.set(xOff, 0.445, 0.18);
      root.add(cuffBase, cuffStone);
      cufflinksMeshes.push(cuffBase);
    });

    return {
      rootGroup: root,
      jacketGroup,
      lapelMeshes,
      jacketMeshes,
      buttonMeshes,
      shirtMeshes,
      tieMesh,
      trouserMeshes,
      pocketSquareMesh,
      vestMeshes,
      cufflinksMeshes,
    };
  }

  // -------------------------------------------------------------
  // SHIRT ONLY DISPLAY
  // -------------------------------------------------------------
  if (isShirt) {
    const shirtChestGeo = new THREE.CylinderGeometry(0.42, 0.35, 0.9, 32);
    const shirtChest = new THREE.Mesh(shirtChestGeo, shirtMaterial);
    shirtChest.position.set(0, 0.7, 0);
    shirtChest.scale.set(1.05, 1.0, 0.65);
    shirtChest.castShadow = true;
    root.add(shirtChest);
    shirtMeshes.push(shirtChest);

    // Collar
    const collarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.03), shirtMaterial);
    collarLeft.position.set(-0.09, 1.15, 0.2);
    collarLeft.rotation.set(-0.2, 0.35, -0.38);
    const collarRight = collarLeft.clone();
    collarRight.position.x = 0.09;
    collarRight.rotation.set(-0.2, -0.35, 0.38);
    root.add(collarLeft, collarRight);
    shirtMeshes.push(collarLeft, collarRight);

    // Center placket
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.9, 0.02), shirtMaterial);
    placket.position.set(0, 0.7, 0.22);
    root.add(placket);

    // Pearl buttons down shirt front
    const pearlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.3 });
    for (let i = 0; i < 6; i++) {
      const pBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.008, 16), pearlMat);
      pBtn.rotation.x = Math.PI / 2;
      pBtn.position.set(0, 1.05 - i * 0.14, 0.232);
      root.add(pBtn);
      buttonMeshes.push(pBtn);
    }

    // Shirt sleeves
    const sLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.92, 24), shirtMaterial);
    sLeft.position.set(-0.48, 0.6, 0.02);
    sLeft.rotation.set(0.05, 0, 0.2);
    const sRight = sLeft.clone();
    sRight.position.x = 0.48;
    sRight.rotation.z = -0.2;
    root.add(sLeft, sRight);
    shirtMeshes.push(sLeft, sRight);

    // French Cuffs with cufflinks
    [-0.56, 0.56].forEach((xPos) => {
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.08, 24), shirtMaterial);
      cuff.position.set(xPos, 0.18, 0.04);
      cuff.rotation.z = xPos < 0 ? 0.2 : -0.2;
      root.add(cuff);
      const cl = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.02, 12), buttonMaterial);
      cl.position.set(xPos + (xPos < 0 ? -0.05 : 0.05), 0.18, 0.05);
      cl.rotation.z = Math.PI / 2;
      root.add(cl);
      cufflinksMeshes.push(cl);
    });

    // Lower Trousers
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.13, 1.6, 24), trouserMaterial);
    leftLeg.position.set(-0.18, -0.92, 0);
    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.18;
    root.add(leftLeg, rightLeg);
    trouserMeshes.push(leftLeg, rightLeg);

    return {
      rootGroup: root,
      jacketGroup,
      lapelMeshes,
      jacketMeshes,
      buttonMeshes,
      shirtMeshes,
      tieMesh,
      trouserMeshes,
      pocketSquareMesh,
      vestMeshes,
      cufflinksMeshes,
    };
  }

  // -------------------------------------------------------------
  // WAISTCOAT ONLY DISPLAY
  // -------------------------------------------------------------
  if (isWaistcoat) {
    // Inner crisp shirt
    const innerShirt = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.85, 32), shirtMaterial);
    innerShirt.position.set(0, 0.72, 0);
    innerShirt.scale.set(1.0, 1.0, 0.65);
    root.add(innerShirt);

    // Collar & tie
    const collarLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.04), shirtMaterial);
    collarLeft.position.set(-0.08, 1.14, 0.2);
    collarLeft.rotation.set(-0.2, 0.3, -0.4);
    const collarRight = collarLeft.clone();
    collarRight.position.x = 0.08;
    collarRight.rotation.set(-0.2, -0.3, 0.4);
    root.add(collarLeft, collarRight);

    const tieBlade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.015), tieMaterial);
    tieBlade.position.set(0, 0.8, 0.24);
    root.add(tieBlade);
    tieMesh = tieBlade;

    // Tailored Vest Torso
    const vestGeo = new THREE.CylinderGeometry(0.44, 0.39, 0.82, 32);
    const vest = new THREE.Mesh(vestGeo, suitMaterial);
    vest.position.set(0, 0.66, 0.02);
    vest.scale.set(1.06, 1.0, 0.68);
    root.add(vest);
    vestMeshes.push(vest);

    // 6 Vest Horn Buttons down front
    for (let row = 0; row < 5; row++) {
      const bY = 0.9 - row * 0.12;
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 16), buttonMaterial);
      b.rotation.x = Math.PI / 2;
      b.position.set(0, bY, 0.26);
      root.add(b);
      buttonMeshes.push(b);
    }

    // Dual Welt Pockets
    [-0.18, 0.18].forEach((xP) => {
      const welt = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.02), suitMaterial);
      welt.position.set(xP, 0.48, 0.24);
      root.add(welt);
    });

    // Lower Trousers
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.13, 1.6, 24), trouserMaterial);
    leftLeg.position.set(-0.18, -0.92, 0);
    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.18;
    root.add(leftLeg, rightLeg);
    trouserMeshes.push(leftLeg, rightLeg);

    return {
      rootGroup: root,
      jacketGroup,
      lapelMeshes,
      jacketMeshes,
      buttonMeshes,
      shirtMeshes,
      tieMesh,
      trouserMeshes,
      pocketSquareMesh,
      vestMeshes,
      cufflinksMeshes,
    };
  }

  // -------------------------------------------------------------
  // TROUSERS FOCUS DISPLAY
  // -------------------------------------------------------------
  if (isTrouser) {
    // Upper Dress Shirt Mannequin
    const shirtTop = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.7, 32), shirtMaterial);
    shirtTop.position.set(0, 0.8, 0);
    shirtTop.scale.set(1.0, 1.0, 0.62);
    root.add(shirtTop);

    // High Gurkha Extended Waistband
    const bandGeo = new THREE.CylinderGeometry(0.39, 0.4, 0.16, 32);
    const waistBand = new THREE.Mesh(bandGeo, trouserMaterial);
    waistBand.position.set(0, 0.38, 0);
    waistBand.scale.set(1.04, 1.0, 0.65);
    root.add(waistBand);

    // Brass Side Adjuster Buckles
    const buckleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.15 });
    [-0.38, 0.38].forEach((bX) => {
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.03), buckleMat);
      buckle.position.set(bX, 0.38, 0.05);
      root.add(buckle);
    });

    // Trouser Legs
    const leftLegGeo = new THREE.CylinderGeometry(0.2, 0.14, 1.65, 24);
    const leftLeg = new THREE.Mesh(leftLegGeo, trouserMaterial);
    leftLeg.position.set(-0.18, -0.65, 0);
    leftLeg.castShadow = true;
    root.add(leftLeg);

    const rightLeg = new THREE.Mesh(leftLegGeo, trouserMaterial);
    rightLeg.position.set(0.18, -0.65, 0);
    rightLeg.castShadow = true;
    root.add(rightLeg);
    trouserMeshes.push(leftLeg, rightLeg);

    // Sharp Front Crease Lines
    const creaseGeo = new THREE.BoxGeometry(0.008, 1.6, 0.01);
    const creaseMat = new THREE.MeshBasicMaterial({ color: 0x3a4254 });
    const creaseLeft = new THREE.Mesh(creaseGeo, creaseMat);
    creaseLeft.position.set(-0.18, -0.65, 0.17);
    const creaseRight = creaseLeft.clone();
    creaseRight.position.x = 0.18;
    root.add(creaseLeft, creaseRight);

    // 2-Inch Cuffed Hem Turn-ups at bottom
    [-0.18, 0.18].forEach((xP) => {
      const cuffHem = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.08, 24), trouserMaterial);
      cuffHem.position.set(xP, -1.45, 0);
      root.add(cuffHem);
    });

    return {
      rootGroup: root,
      jacketGroup,
      lapelMeshes,
      jacketMeshes,
      buttonMeshes,
      shirtMeshes,
      tieMesh,
      trouserMeshes,
      pocketSquareMesh,
      vestMeshes,
      cufflinksMeshes,
    };
  }

  // -------------------------------------------------------------
  // JACKET / SUIT SILHOUETTES: 2-Piece, 3-Piece, Tuxedo, Blazer, Bandhgala
  // -------------------------------------------------------------
  // 2. Dress Shirt (Inner Chest & Collar)
  const shirtGeo = new THREE.CylinderGeometry(0.32, 0.38, 0.85, 32);
  const shirt = new THREE.Mesh(shirtGeo, shirtMaterial);
  shirt.position.set(0, 0.72, 0);
  shirt.scale.set(1.0, 1.0, 0.65);
  root.add(shirt);
  shirtMeshes.push(shirt);

  // Shirt Collar Wings
  const collarLeftGeo = new THREE.BoxGeometry(0.12, 0.09, 0.04);
  const collarLeft = new THREE.Mesh(collarLeftGeo, shirtMaterial);
  collarLeft.position.set(-0.08, 1.14, 0.2);
  collarLeft.rotation.set(-0.2, 0.3, -0.4);
  root.add(collarLeft);

  const collarRight = collarLeft.clone();
  collarRight.position.set(0.08, 1.14, 0.2);
  collarRight.rotation.set(-0.2, -0.3, 0.4);
  root.add(collarRight);
  shirtMeshes.push(collarLeft, collarRight);

  // 3. Necktie or Bowtie
  if (isTuxedo) {
    const bowCenterGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 16);
    const bowCenter = new THREE.Mesh(bowCenterGeo, tieMaterial);
    bowCenter.rotation.z = Math.PI / 2;
    bowCenter.position.set(0, 1.1, 0.22);

    const bowWingGeo = new THREE.ConeGeometry(0.09, 0.18, 16);
    const bowLeft = new THREE.Mesh(bowWingGeo, tieMaterial);
    bowLeft.rotation.z = -Math.PI / 2;
    bowLeft.position.set(-0.1, 1.1, 0.22);
    bowLeft.scale.set(0.5, 1, 0.35);

    const bowRight = new THREE.Mesh(bowWingGeo, tieMaterial);
    bowRight.rotation.z = Math.PI / 2;
    bowRight.position.set(0.1, 1.1, 0.22);
    bowRight.scale.set(0.5, 1, 0.35);

    const bowGroup = new THREE.Group();
    bowGroup.add(bowCenter, bowLeft, bowRight);
    root.add(bowGroup);
  } else if (!isBandhgala) {
    const knotGeo = new THREE.ConeGeometry(0.05, 0.08, 16);
    const tieKnot = new THREE.Mesh(knotGeo, tieMaterial);
    tieKnot.rotation.x = Math.PI;
    tieKnot.position.set(0, 1.1, 0.23);

    const tieBladeGeo = new THREE.BoxGeometry(0.08, 0.65, 0.015);
    const tieBlade = new THREE.Mesh(tieBladeGeo, tieMaterial);
    tieBlade.position.set(0, 0.74, 0.24);
    tieBlade.rotation.x = -0.05;

    const tieBarGeo = new THREE.BoxGeometry(0.07, 0.01, 0.02);
    const tieBarMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb, metalness: 0.95, roughness: 0.1 });
    const tieBar = new THREE.Mesh(tieBarGeo, tieBarMat);
    tieBar.position.set(0, 0.78, 0.25);

    const tieGroup = new THREE.Group();
    tieGroup.add(tieKnot, tieBlade, tieBar);
    root.add(tieGroup);
    tieMesh = tieBlade;
  }

  // 4. Waistcoat / Vest (If 3-Piece)
  if (isThreePiece) {
    const vestGeo = new THREE.CylinderGeometry(0.35, 0.41, 0.75, 32);
    const vest = new THREE.Mesh(vestGeo, suitMaterial);
    vest.position.set(0, 0.66, 0.02);
    vest.scale.set(1.02, 1.0, 0.68);
    root.add(vest);
    vestMeshes.push(vest);

    for (let row = 0; row < 3; row++) {
      const bY = 0.85 - row * 0.14;
      const bLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 16), buttonMaterial);
      bLeft.rotation.x = Math.PI / 2;
      bLeft.position.set(-0.06, bY, 0.26);
      const bRight = bLeft.clone();
      bRight.position.x = 0.06;
      root.add(bLeft, bRight);
      buttonMeshes.push(bLeft, bRight);
    }
  }

  // 5. Tailored Jacket Body
  const chestGeo = new THREE.CylinderGeometry(0.48, 0.38, 0.85, 32);
  const chestMesh = new THREE.Mesh(chestGeo, suitMaterial);
  chestMesh.position.set(0, 0.7, 0);
  chestMesh.scale.set(1.12, 1.0, 0.62);
  chestMesh.castShadow = true;
  chestMesh.receiveShadow = true;
  jacketGroup.add(chestMesh);
  jacketMeshes.push(chestMesh);

  // Lower Jacket Skirt
  const skirtGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.55, 32);
  const skirtMesh = new THREE.Mesh(skirtGeo, suitMaterial);
  skirtMesh.position.set(0, 0.12, 0);
  skirtMesh.scale.set(1.08, 1.0, 0.62);
  skirtMesh.castShadow = true;
  jacketGroup.add(skirtMesh);
  jacketMeshes.push(skirtMesh);

  // 6. Jacket Lapels (Left & Right)
  if (isBandhgala) {
    const bandGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.16, 32, 1, true);
    const band = new THREE.Mesh(bandGeo, lapelMaterial);
    band.position.set(0, 1.18, 0.04);
    band.scale.set(1.0, 1.0, 0.7);
    jacketGroup.add(band);
    lapelMeshes.push(band);

    const placketGeo = new THREE.BoxGeometry(0.06, 1.0, 0.02);
    const placket = new THREE.Mesh(placketGeo, lapelMaterial);
    placket.position.set(0, 0.65, 0.22);
    jacketGroup.add(placket);

    for (let i = 0; i < 5; i++) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.012, 16), buttonMaterial);
      b.rotation.x = Math.PI / 2;
      b.position.set(0, 1.05 - i * 0.18, 0.235);
      jacketGroup.add(b);
      buttonMeshes.push(b);
    }
  } else {
    const lapelLeftGeo = new THREE.BoxGeometry(0.18, 0.72, 0.04);
    const lapelLeft = new THREE.Mesh(lapelLeftGeo, lapelMaterial);
    lapelLeft.position.set(-0.22, 0.76, 0.19);
    lapelLeft.rotation.set(-0.12, 0.35, -0.32);
    lapelLeft.castShadow = true;
    jacketGroup.add(lapelLeft);

    const lapelRight = lapelLeft.clone();
    lapelRight.position.set(0.22, 0.76, 0.19);
    lapelRight.rotation.set(-0.12, -0.35, 0.32);
    lapelRight.castShadow = true;
    jacketGroup.add(lapelRight);
    lapelMeshes.push(lapelLeft, lapelRight);

    const btn1 = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.012, 16), buttonMaterial);
    btn1.rotation.x = Math.PI / 2;
    btn1.position.set(0.01, 0.48, 0.23);
    jacketGroup.add(btn1);
    buttonMeshes.push(btn1);

    const btn2 = btn1.clone();
    btn2.position.set(0.01, 0.34, 0.23);
    jacketGroup.add(btn2);
    buttonMeshes.push(btn2);
  }

  // 7. Pockets & Barchetta Breast Pocket with Silk Square
  const chestPocketGeo = new THREE.BoxGeometry(0.13, 0.024, 0.02);
  const chestPocket = new THREE.Mesh(chestPocketGeo, lapelMaterial);
  chestPocket.position.set(-0.25, 0.88, 0.21);
  chestPocket.rotation.z = 0.08;
  jacketGroup.add(chestPocket);

  const squareGeo = new THREE.ConeGeometry(0.04, 0.07, 4);
  const pSquare = new THREE.Mesh(squareGeo, pocketSquareMaterial);
  pSquare.position.set(-0.25, 0.92, 0.22);
  pSquare.rotation.set(0, Math.PI / 4, 0.05);
  jacketGroup.add(pSquare);
  pocketSquareMesh = pSquare;

  const flapPocketLeft = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.03), suitMaterial);
  flapPocketLeft.position.set(-0.32, 0.24, 0.18);
  flapPocketLeft.rotation.set(0.05, 0.3, -0.05);
  jacketGroup.add(flapPocketLeft);

  const flapPocketRight = flapPocketLeft.clone();
  flapPocketRight.position.set(0.32, 0.24, 0.18);
  flapPocketRight.rotation.set(0.05, -0.3, 0.05);
  jacketGroup.add(flapPocketRight);

  // 8. Sculpted Sleeves & Shoulders
  const shoulderPadLeft = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), suitMaterial);
  shoulderPadLeft.position.set(-0.46, 1.05, 0);
  shoulderPadLeft.scale.set(1.2, 0.7, 1.0);
  jacketGroup.add(shoulderPadLeft);

  const shoulderPadRight = shoulderPadLeft.clone();
  shoulderPadRight.position.x = 0.46;
  jacketGroup.add(shoulderPadRight);
  jacketMeshes.push(shoulderPadLeft, shoulderPadRight);

  const sleeveLeftGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.95, 24);
  const sleeveLeft = new THREE.Mesh(sleeveLeftGeo, suitMaterial);
  sleeveLeft.position.set(-0.52, 0.58, 0.02);
  sleeveLeft.rotation.set(0.05, 0, 0.22);
  sleeveLeft.castShadow = true;
  jacketGroup.add(sleeveLeft);

  const sleeveRight = new THREE.Mesh(sleeveLeftGeo, suitMaterial);
  sleeveRight.position.set(0.52, 0.58, 0.02);
  sleeveRight.rotation.set(0.05, 0, -0.22);
  sleeveRight.castShadow = true;
  jacketGroup.add(sleeveRight);
  jacketMeshes.push(sleeveLeft, sleeveRight);

  for (let c = 0; c < 4; c++) {
    const cuffBtnLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 12), buttonMaterial);
    cuffBtnLeft.rotation.z = Math.PI / 2;
    cuffBtnLeft.position.set(-0.62, 0.2 + c * 0.025, 0.05);
    jacketGroup.add(cuffBtnLeft);

    const cuffBtnRight = cuffBtnLeft.clone();
    cuffBtnRight.position.x = 0.62;
    jacketGroup.add(cuffBtnRight);
    cufflinksMeshes.push(cuffBtnLeft, cuffBtnRight);
  }

  // 9. Trousers (Impeccably pressed front crease)
  const leftLegGeo = new THREE.CylinderGeometry(0.18, 0.13, 1.6, 24);
  const leftLeg = new THREE.Mesh(leftLegGeo, trouserMaterial);
  leftLeg.position.set(-0.18, -0.92, 0);
  leftLeg.castShadow = true;
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(leftLegGeo, trouserMaterial);
  rightLeg.position.set(0.18, -0.92, 0);
  rightLeg.castShadow = true;
  root.add(rightLeg);
  trouserMeshes.push(leftLeg, rightLeg);

  const creaseGeo = new THREE.BoxGeometry(0.008, 1.58, 0.01);
  const creaseMat = new THREE.MeshBasicMaterial({ color: 0x3a4254, wireframe: false });
  const creaseLeft = new THREE.Mesh(creaseGeo, creaseMat);
  creaseLeft.position.set(-0.18, -0.92, 0.16);
  root.add(creaseLeft);

  const creaseRight = creaseLeft.clone();
  creaseRight.position.x = 0.18;
  root.add(creaseRight);

  // 10. Optional Cloth Physics Simulation Swatch Mesh
  let clothSimulationMesh: THREE.Mesh | undefined;
  if (options.includeClothSimulation) {
    const clothGeo = new THREE.PlaneGeometry(0.65, 0.9, 24, 24);
    const clothMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(options.suitColorHex),
      side: THREE.DoubleSide,
      roughness: options.roughness,
      metalness: options.metalness,
      bumpMap: fabricTex,
      bumpScale: 0.015,
    });
    clothSimulationMesh = new THREE.Mesh(clothGeo, clothMat);
    clothSimulationMesh.name = 'ClothSimulationBanner';
    clothSimulationMesh.position.set(1.1, 0.7, 0);
    clothSimulationMesh.rotation.y = -Math.PI / 4;
    root.add(clothSimulationMesh);
  }

  return {
    rootGroup: root,
    jacketGroup,
    lapelMeshes,
    jacketMeshes,
    buttonMeshes,
    shirtMeshes,
    tieMesh,
    trouserMeshes,
    pocketSquareMesh,
    vestMeshes,
    cufflinksMeshes,
    clothSimulationMesh,
  };
}

// Particle System around Suit (Floating woven dust motes and Meta light fibers)
export function createAtmosphericParticles(count = 140): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const color1 = new THREE.Color('#0064E0'); // Meta blue
  const color2 = new THREE.Color('#00D2FF'); // Cyan
  const color3 = new THREE.Color('#E0A900'); // Gold

  for (let i = 0; i < count; i++) {
    // Spread in a soft cylinder around suit
    const radius = 0.8 + Math.random() * 1.8;
    const theta = Math.random() * Math.PI * 2;
    const y = -1.5 + Math.random() * 3.2;

    positions[i * 3] = radius * Math.cos(theta);
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = radius * Math.sin(theta);

    const rand = Math.random();
    const c = rand < 0.5 ? color1 : rand < 0.85 ? color2 : color3;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}
