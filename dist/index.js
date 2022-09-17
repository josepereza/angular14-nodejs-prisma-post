"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const tmpFolder = path_1.default.resolve(__dirname, '..', 'public/images');
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tmpFolder);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = ['http://localhost:4200'];
const options = {
    origin: allowedOrigins
};
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
//app.use('/public',express.static(path.resolve(__dirname,'public')));
app.use('/public', express_1.default.static(path_1.default.resolve('public')));
app.use((0, cors_1.default)(options));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.get('/prueba', (req, res) => {
    console.log('prueba bababa');
    res.send('probando');
});
app.post('/imagen', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('mi rererere', req.body);
    const { title, content, authorEmail } = req.body;
    const usuario = {
        title,
        content,
        published: false,
        author: { connect: { email: authorEmail } },
        image_name: ' '
    };
    var file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname;
    file
        ? (usuario.image_name = `http://localhost:3000/public/images/${file}`)
        : (usuario.image_name = ' ');
    let user = yield prisma.post.create({ data: usuario });
    res.json(usuario);
}));
app.post('/post', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, authorEmail } = req.body;
    console.log('cago', title, content, authorEmail);
    prisma.post.create({
        data: {
            title,
            content,
            published: false,
            author: { connect: { email: authorEmail } },
        },
    }).then(data => {
        console.log('mis dato', data);
        res.json(data);
    });
}));
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany();
    res.json(users);
}));
app.post('/buscar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let dato = req.body.dato;
    console.log(dato);
    const users = yield prisma.post.findMany({
        where: {
            OR: [{
                    title: {
                        contains: dato,
                    }
                },
                {
                    content: {
                        contains: dato
                    }
                },
            ]
        }
    });
    res.json(users);
}));
app.get('/usersPost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany({
        include: { posts: true }
    });
    res.json(users);
}));
app.get('/feed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield prisma.post.findMany({
        where: { published: true },
        include: { author: true }
    });
    res.json(posts);
}));
app.get(`/post/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield prisma.post.findUnique({
        where: { id: Number(id) },
    });
    res.json(post);
}));
app.post(`/user`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma.user.create({
        data: Object.assign({}, req.body),
    });
    res.json(result);
}));
app.put('/post/publish/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield prisma.post.update({
        where: { id: Number(id) },
        data: { published: true },
    });
    res.json(post);
}));
app.delete(`/post/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield prisma.post.delete({
        where: { id: Number(id) },
    });
    res.json(post);
}));
app.listen(3000, () => console.log('REST API server ready at: http://localhost:3000'));
