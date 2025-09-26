// Lista de todas las imágenes de Arch disponibles
// Excluimos Logo.png ya que es el logo del sitio
const archImages = [
  "ArchPlayingWithBooks.png",
  "ArchReadingABook.png",
  "ArchReadingAJoke.png",
  "ArchiveOfMemeArch.png",
  "MultiArch.png",
  "SmileArch.png",
  "WenArch.png",
  "ArchApproved.png",
  "ArchArchived.png",
  "ArchFunny.png",
];

// Mensajes aleatorios divertidos para Arch
const archMessages = [
  "Hi! I'm Arch, your meme archivist!",
  "Click me to see my other forms!",
  "Preserving memes since 2024!",
  "We're all Arch!",
  "Memes are eternal!",
  "Hi! I'm Arch, collecting culture!",
  "Archive everything!",
  "The internet never forgets!",
  "Meme preservation specialist!",
  "Click for more Arch!",
];

// Función para detectar automáticamente nuevas imágenes
async function loadArchImages() {
  try {
    // Intentamos cargar cada imagen para verificar si existe
    // Si agregas más imágenes, solo añádelas a la carpeta y actualiza esta lista
    const additionalImages = [
      // Aquí puedes agregar nombres de nuevas imágenes si las subes
      // Por ejemplo: 'ArchDancing.png', 'ArchSleeping.png', etc.
    ];

    // Combinamos las imágenes conocidas con las adicionales
    return [...archImages, ...additionalImages].filter(
      (img) => img !== "Logo.png"
    );
  } catch (error) {
    // Si hay error, usamos la lista por defecto
    return archImages;
  }
}

function getRandomMessage() {
  return archMessages[Math.floor(Math.random() * archMessages.length)];
}

async function setRandomArch() {
  const archDecoration = document.querySelector(".arch-decoration");
  if (!archDecoration) return;

  // Obtenemos la lista de imágenes disponibles
  const availableImages = await loadArchImages();

  // Si no hay imágenes, no hacemos nada
  if (availableImages.length === 0) return;

  // Seleccionamos una imagen aleatoria
  let currentIndex = Math.floor(Math.random() * availableImages.length);

  function updateArch(index) {
    const selectedImage = availableImages[index];
    archDecoration.style.backgroundImage = `url('../assets/img/${selectedImage}')`;
    archDecoration.setAttribute("title", getRandomMessage());
  }

  // Establecemos la imagen inicial
  updateArch(currentIndex);

  // Al hacer clic, cambiamos a la siguiente imagen
  archDecoration.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % availableImages.length;
    updateArch(currentIndex);

    // Agregamos animación de giro
    archDecoration.style.animation = "none";
    setTimeout(() => {
      archDecoration.style.animation =
        "float 3s ease-in-out infinite, spin 0.5s ease-in-out";
    }, 10);

    // Cambiamos el mensaje también
    archDecoration.setAttribute("title", getRandomMessage());
  });

  // Cambiamos el mensaje al hacer hover (opcional)
  archDecoration.addEventListener("mouseenter", () => {
    if (Math.random() > 0.7) {
      // 30% de probabilidad de cambiar el mensaje
      archDecoration.setAttribute("title", getRandomMessage());
    }
  });
}

// Iniciamos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", setRandomArch);

// Instrucciones para agregar nuevas imágenes:
// 1. Sube la nueva imagen a la carpeta /assets/img/
// 2. Agrega el nombre del archivo al array archImages arriba
// 3. Las nuevas imágenes aparecerán automáticamente en la rotación

// Nota: Si quieres que sea completamente dinámico sin editar código,
// necesitarías un backend que liste los archivos de la carpeta.
