    let model;
    const video = document.getElementById('video');
    const faceBox = document.getElementById('faceBox');
    const startBtn = document.getElementById('startBtn');
    const cameraSection = document.getElementById('cameraSection');
    const formSection = document.getElementById('formSection');
    const portalSound = document.getElementById('portalSound');

    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    }

    async function loadBlazeFaceModel() {
      model = await blazeface.load();
    }

    async function detectFace() {
      const predictions = await model.estimateFaces(video, false);
      if (predictions.length > 0) {
        const face = predictions[0].topLeft;
        const x = face[0];
        const y = face[1];
        faceBox.style.left = `${x}px`;
        faceBox.style.top = `${y}px`;
      }
      requestAnimationFrame(detectFace);
    }

    startBtn.addEventListener('click', async () => {
      cameraSection.classList.remove('hidden');
      cameraSection.style.opacity = "0";
      setTimeout(() => cameraSection.style.opacity = "1", 500);
      portalSound.play();
      await setupCamera();
      await loadBlazeFaceModel();
      detectFace();
      formSection.classList.remove('hidden');
    });

    // Captura da imagem
    const captureBtn = document.getElementById('captureBtn');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let imageDataUrl = '';

    captureBtn.addEventListener('click', () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      imageDataUrl = canvas.toDataURL('image/png');
      canvas.classList.remove('hidden');
    });

    // Enviar pelo WhatsApp
    const whatsappForm = document.getElementById('whatsappForm');
    const phoneNumberInput = document.getElementById('phoneNumber');

    whatsappForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = phoneNumberInput.value.replace(/\D/g, '');
      if (!imageDataUrl) {
        alert('Por favor, tire uma foto primeiro.');
        return;
      }
      if (!phone) {
        alert('Digite um número de WhatsApp válido.');
        return;
      }

      const whatsappLink = `https://wa.me/55${phone}?text=Ol%C3%A1!%20Segue%20a%20foto%20tirada%20com%20a%20vis%C3%A3o%20computacional.%20(Salve%20a%20imagem%20abaixo%20e%20envie%20manualmente)`;
      window.open(whatsappLink, '_blank');
    });