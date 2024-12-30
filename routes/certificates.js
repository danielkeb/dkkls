const express= require('express');
const {PrismaClient}= require("@prisma/client");
const prisma= new PrismaClient();
const router = express.Router();

router.post('/', async (req, res)=>{
    try{
  const certificate= await prisma.Certificate.create(req.body);
    res.status(201).json(certificate);
    }catch(error){
        console.log()
        throw err({error:error.message});
    }
})

router.get('/get', async (req,res)=>{
    try{
        const cert= await prisma.Certificate.findAll();
        res.status(200).json(cert);

    }catch(err){
        throw err
    }
})



// Get a specific certificate by ID
router.get('/:id', async (req, res) => {
  try {
    const certificate = await prisma.Certificate.findByPk(req.params.id);
    if (!certificate) return res.status(404).json({ error: 'certificate not found' });
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a certificate by ID
router.put('/:id', async (req, res) => {
  try {
    const certificate = await prisma.Certificate.findByPk(req.params.id);
    if (!certificate) return res.status(404).json({ error: 'certificate not found' });

    await cateCertificate.update(req.body);
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a certificate by ID
router.delete('/:id', async (req, res) => {
  try {
    const certificate = await prisma.Certificate.findByPk(req.params.id);
    if (!certificate) return res.status(404).json({ error: 'certificate not found' });

    await cateCertificate.destroy();
    res.json({ message: 'certificate deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
