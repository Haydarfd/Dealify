--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer DEFAULT nextval('public.categories_id_seq'::regclass) NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer NOT NULL,
    listing_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.listings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listings_id_seq OWNER TO postgres;

--
-- Name: listings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listings (
    id integer DEFAULT nextval('public.listings_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    category_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    price numeric(10,2),
    package_id integer,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    city character varying,
    address character varying,
    image_paths text[],
    thumb_path character varying,
    subcategory_id integer,
    CONSTRAINT listings_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'expired'::character varying, 'sold'::character varying])::text[])))
);


ALTER TABLE public.listings OWNER TO postgres;

--
-- Name: packages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.packages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.packages_id_seq OWNER TO postgres;

--
-- Name: packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.packages (
    id integer DEFAULT nextval('public.packages_id_seq'::regclass) NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    max_listings integer NOT NULL,
    CONSTRAINT packages_max_listings_check CHECK ((max_listings >= 0))
);


ALTER TABLE public.packages OWNER TO postgres;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    listing_id integer NOT NULL,
    reason character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq OWNER TO postgres;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_id_seq OWNER TO postgres;

--
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales (
    id integer DEFAULT nextval('public.sales_id_seq'::regclass) NOT NULL,
    buyer_id integer NOT NULL,
    seller_id integer NOT NULL,
    listing_id integer NOT NULL,
    price numeric(10,2) NOT NULL,
    sale_date timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- Name: subcategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subcategories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    category_id integer NOT NULL
);


ALTER TABLE public.subcategories OWNER TO postgres;

--
-- Name: subcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subcategories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subcategories_id_seq OWNER TO postgres;

--
-- Name: subcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subcategories_id_seq OWNED BY public.subcategories.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    phone character varying(20),
    role character varying(20) DEFAULT 'buyer'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    city text,
    listings_count numeric DEFAULT 6,
    package_id integer,
    avatar character varying(255),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['buyer'::character varying, 'seller'::character varying, 'admin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- Name: subcategories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories ALTER COLUMN id SET DEFAULT nextval('public.subcategories_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name) FROM stdin;
1	Properties For Sale
2	Properties For Rent
3	Home & Garden
4	Cars & Vehicles
5	Motorcycles & Scooters
6	Electronics
7	Appliances
8	Men's Apparel
9	Women's Apparel
10	Kids, Toys & Baby
11	Fitness & Sports Equipment
12	Professional Services
13	Jobs & Freelance
14	Courses & Training
15	Books
16	Pets & Pet Supplies
17	Tickets & Experiences
18	Miscellaneous
19	Advertising Spaces
20	License Plates
21	Boats
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, listing_id, created_at) FROM stdin;
88	64	53	2025-07-01 08:45:09.712045
89	64	54	2025-07-01 14:23:19.284082
90	61	64	2025-07-01 14:37:14.951886
93	68	67	2025-07-01 15:33:59.743862
94	61	53	2025-07-03 20:59:04.680927
99	61	84	2025-07-08 23:29:04.033307
102	61	141	2025-07-16 20:44:20.799548
103	61	94	2025-09-21 21:39:25.589219
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.listings (id, user_id, category_id, title, description, price, package_id, status, created_at, city, address, image_paths, thumb_path, subcategory_id) FROM stdin;
148	140	6	ASUS GEFORCE RTX 5090 32GB TUF GAMING 	• Product Type: Graphics. are \r\n• Brand & Model: Asus Geforce Rtx 5090\r\n• Condition: New\r\n• Storage: 32GB\r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	6000.00	\N	pending	2025-08-20 12:01:30.810002	Dubai	Airport road 	{uploads/IMG_4106.webp,uploads/IMG_4105.webp,uploads/IMG_4101.webp}	uploads/thumbs/thumb_IMG_4106.webp	\N
149	140	6	NINTENDO SWITCH OLED VERSION + CONTROLLER + GAMES 	• Product Type: HANDLED CONSOLES\r\n• Brand & Model: NINTENDO SWITCH OLED VERSION 64GB\r\n• Condition: New\r\n• Storage: 64GB\r\n• Screen Size: \r\n• Warranty: \r\n• Accessories:	750.00	\N	pending	2025-08-20 12:05:13.724232	Fujairah	Railway Road 	{uploads/IMG_4582.webp}	uploads/thumbs/thumb_IMG_4582.webp	\N
150	140	6	VIVO X100 ULTRA 5GB UNLOCKED 	• Product Type: MOBILE PHONE \r\n• Brand & Model: VIVO X100 ULTRA 5G\r\n• Condition: New\r\n• Storage: 512GB\r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories: complete	3000.00	\N	pending	2025-08-20 12:08:17.23806	Ajman	Bin Khalid road 	{uploads/IMG_4835.webp,uploads/IMG_4832.webp}	uploads/thumbs/thumb_IMG_4835.webp	\N
151	140	6	DJI MARVIC 4 PRO DRONE + RC2  NEW SEALED 	• Product Type: DRONE \r\n• Brand & Model: DJI MARVIC 4 PRO  \r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	4000.00	\N	pending	2025-08-20 12:14:39.380422	Ras Al Khaimah	Ras Al Khaimah 	{uploads/IMG_4385.webp}	uploads/thumbs/thumb_IMG_4385.webp	\N
215	151	6	ETISALAT HOME INTERNET	• Type: Appliances\r\n• Brand & Model: Huawei\r\n• Condition: New\r\n• Warranty: Yes\r\n• Accessories: Router	159.00	\N	pending	2025-10-23 19:33:19.366494	Dubai	E	{uploads/1000432534.jpg}	uploads/thumbs/thumb_1000432534.jpg	20
152	143	6	Dell 	• Product Type: Laptop \r\n• Brand & Model: Precision 5570\r\n• Condition: Like New\r\n• Storage: 32/1Tb\r\n• Screen Size: 15.6\r\n• Warranty: Yes\r\n• Accessories: Charger	2000.00	\N	pending	2025-09-07 11:48:36.928778	Dubai	Dubai border	{uploads/1000091079.jpg,uploads/1000091080.jpg,uploads/1000091081.jpg}	uploads/thumbs/thumb_1000091079.jpg	\N
155	148	6	iPhone 14 Pro (512GB) USA 🇺🇸 dual eSIM 	• Product Type: Phone \r\n• Brand & Model: iPhone 14 Pro \r\n• Condition: Used\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: No\r\n• Accessories: No	1799.00	\N	pending	2025-10-02 00:01:16.360711	Dubai	Al baraha Dubai 	{uploads/IMG_3954.jpeg,uploads/IMG_3957.jpeg,uploads/IMG_3958.jpeg,uploads/IMG_3961.jpeg,uploads/IMG_0273.png}	uploads/thumbs/thumb_IMG_3954.jpeg	\N
112	115	6	Desktop Fast Charger	• Product Type: USB Chargers\r\n• Brand & Model: GAN \r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	70.00	\N	pending	2025-07-12 12:05:31.632299	Dubai	Al Murar	{uploads/IMG_6071.jpeg}	uploads/thumbs/thumb_IMG_6071.jpeg	\N
153	146	8	G-shock	• Item Type: Watch \r\n• Brand: G-shock \r\n• Condition: Like New\r\n• Size: 49.6x43.2x12.9\r\n• Color: Black and silver \r\n• Material: Silicon	1000.00	\N	pending	2025-09-28 12:44:31.360644	Sharjah	Sharjah al khezamia 	{uploads/IMG_7381.jpeg,uploads/IMG_7385.jpeg,uploads/IMG_7384.jpeg,uploads/IMG_7383.jpeg}	uploads/thumbs/thumb_IMG_7381.jpeg	\N
156	149	4	Lexus IS300 2017	• Make & Model: Lexus IS300 \r\n• Year: 2017\r\n• KM Driven: 168000\r\n• Body Type: Sedan\r\n• Doors: 4\r\n• Transmission: Automatic\r\n• Fuel Type: Petrol\r\n• Color: White\r\n• Previous Owners: Unknown\r\n• Service History: Full\r\n• Warranty: Yes\r\n• Accident History: Minor	55000.00	\N	pending	2025-10-02 21:25:26.672158	Ajman	Al jurf ajman	{uploads/IMG_3616.jpeg,uploads/IMG_3617.jpeg,uploads/IMG_3618.jpeg,uploads/IMG_3619.jpeg,uploads/IMG_3620.jpeg,uploads/IMG_3621.jpeg,uploads/IMG_3622.jpeg,uploads/IMG_3623.jpeg,uploads/IMG_3624.jpeg}	uploads/thumbs/thumb_IMG_3616.jpeg	\N
52	40	8	Graphic T-Shirt	• Item Type: T -shirt American \r\n• Brand: White \r\n• Condition: New\r\n• Size: X\r\n• Color: White \r\n• Material: Original	100.00	\N	pending	2025-06-28 02:59:53.797731	Dubai	33208 Dubai luna 4	{uploads/IMG_1015.jpeg}	uploads/thumbs/thumb_IMG_1015.jpeg	\N
53	61	17	Atlantis Aquaventure Day Pass	• Event Type: Water Park, Family\r\n• Date: Valid Anytime\r\n• Location: Atlantis The Palm, Dubai\r\n• Seat Category: General Entry	250.00	\N	pending	2025-06-30 18:10:13.804972	Dubai	The Palm 	{uploads/62.jpg}	uploads/thumbs/thumb_62.jpg	\N
54	61	17	Wild Wadi Waterpark Entry Ticket	• Event Type: Water Park, Family\r\n• Date: Valid Anytime\r\n• Location: Jumeirah\r\n• Seat Category: General Entry	200.00	\N	pending	2025-06-30 18:13:34.999701	Dubai	Jumeirah 	{uploads/Wadi-Water_Park.jpg}	uploads/thumbs/thumb_Wadi-Water_Park.jpg	\N
64	64	6	Iphone 12 Pro Pacific Blue 512 GB	• Product Type: Iphone\r\n• Brand & Model: Iphone 12 Pro\r\n• Condition: Used\r\n• Storage: 512 GB\r\n• Screen Size: 6.1”\r\n• Warranty: No\r\n• Accessories: Case	1000.00	\N	pending	2025-07-01 08:39:47.485844	Sharjah	Al Khan 	{uploads/IMG_5600.jpeg,uploads/IMG_5598.jpeg,uploads/IMG_5601.jpeg,uploads/IMG_5599.jpeg,uploads/IMG_5602.jpeg}	uploads/thumbs/thumb_IMG_5600.jpeg	\N
66	45	6	iPhone 11 White 64GB	• Product Type: Phone\r\n• Brand & Model: iPhone 11\r\n• Condition: Used\r\n• Storage: 64GB\r\n• Screen Size: 6.1\r\n• Warranty: Expired\r\n• Accessories: None	450.00	\N	pending	2025-07-01 08:51:00.962319	Sharjah	Al Khan 	{uploads/IMG_3289.jpeg,uploads/IMG_3290.jpeg,uploads/IMG_3291.jpeg,uploads/IMG_3292.jpeg,uploads/IMG_3293.jpeg}	uploads/thumbs/thumb_IMG_3289.jpeg	\N
67	66	6	Gaming PC	• Product Type: Gaming computer\r\n• Brand & Model: 4060ti i7 14700k\r\n• Condition: New\r\n• Storage: 500 gb\r\n• Screen Size: N/A\r\n• Warranty: No\r\n• Accessories: N/A	5100.00	\N	pending	2025-07-01 12:42:57.785014	Dubai	Altwar 3 	{uploads/IMG_3183.jpeg,uploads/IMG_3182.jpeg}	uploads/thumbs/thumb_IMG_3183.jpeg	\N
72	68	8	Omega Swatch 	• Item Type: Watch \r\n• Brand: Omega\r\n• Condition: New\r\n• Size: Watch \r\n• Color: Dessert \r\n• Material:	1300.00	\N	pending	2025-07-01 16:07:14.394669	Dubai	Dubai	{uploads/37ebde38-6405-4e81-b3cc-8ab79866ddae.jpeg}	uploads/thumbs/thumb_37ebde38-6405-4e81-b3cc-8ab79866ddae.jpeg	\N
84	64	4	Lexus LX570	• Make & Model: Lexus LX570\r\n• Year: 2011\r\n• KM Driven: 300,000\r\n• Body Type: SUV\r\n• Doors: 4\r\n• Transmission: Automatic\r\n• Fuel Type: Petrol\r\n• Color: White\r\n• Previous Owners: First Owner\r\n• Service History: Full\r\n• Warranty: No\r\n• Accident History: None	75000.00	\N	pending	2025-07-04 13:41:46.115283	Sharjah	Al Khan	{uploads/IMG_5717.jpeg,uploads/IMG_5718.jpeg,uploads/IMG_5719.jpeg,uploads/IMG_5720.jpeg,uploads/IMG_5721.jpeg,uploads/IMG_5722.jpeg,uploads/IMG_5723.jpeg,uploads/IMG_5724.jpeg}	uploads/thumbs/thumb_IMG_5717.jpeg	\N
86	96	3	King size bed	• Type: Bed\r\n• Brand: Home box\r\n• Condition: Used\r\n• Material: Wood\r\n• Color: Brown\r\n• Size (L×W×H): 180x 200x45\r\n• Used For: 2 years	150.00	\N	pending	2025-07-06 07:02:03.962695	Dubai	Dubai Marina , Al Seba street 	{uploads/IMG_0544.jpeg,uploads/IMG_0543.jpeg,uploads/IMG_0542.jpeg,uploads/IMG_0541.jpeg}	uploads/thumbs/thumb_IMG_0544.jpeg	\N
92	35	8	gc watch	• Item Type: watch\r\n• Brand: guess collection\r\n• Condition: Used\r\n• Size: \r\n• Color: blue\r\n• Material: rubber	500.00	\N	pending	2025-07-07 21:06:39.112145	Dubai	mirdif	{uploads/IMG_4380.jpeg}	uploads/thumbs/thumb_IMG_4380.jpeg	\N
93	80	18	Real madrid 2015-16 signed jersey 	• Item Type: Collectible \r\n• Usage: \r\n• Brand (if any): Benzema worn in game jersey signed	27500.00	\N	pending	2025-07-08 12:35:19.939686	Dubai	Al jaddaf	{uploads/IMG_5179.jpeg,uploads/IMG_5180.jpeg,uploads/IMG_5181.jpeg,uploads/IMG_5183.jpeg}	uploads/thumbs/thumb_IMG_5179.jpeg	\N
94	61	4	BMW M5	• Make & Model: \r\n• Year: \r\n• KM Driven: \r\n• Body Type: \r\n• Doors: \r\n• Transmission: \r\n• Fuel Type: \r\n• Color: \r\n• Previous Owners: \r\n• Service History: \r\n• Warranty: \r\n• Accident History:	160000.00	\N	pending	2025-07-08 23:38:04.69268	Dubai	Marina	{uploads/BMW-M5-Competition-2024_38492_31099329557-17_small.webp}	uploads/thumbs/thumb_BMW-M5-Competition-2024_38492_31099329557-17_small.webp	\N
98	61	1	Dubai Hills Villa	• Type: Apartment\r\n• Location: \r\n• Size (sqft): \r\n• Beds: \r\n• Baths: \r\n• Floor: \r\n• View: \r\n• Furnishing: \r\n• Amenities: \r\n• Ownership:	4000000.00	\N	pending	2025-07-08 23:57:17.690237	Dubai	Dubai Hills	{uploads/1272x624-680x510.jpg.webp}	uploads/thumbs/thumb_1272x624-680x510.jpg.webp	\N
99	113	8	rayban glasses	• Item Type: eyeglasses\r\n• Brand: rayban\r\n• Condition: Like New\r\n• Size: \r\n• Color: black\r\n• Material:	400.00	\N	pending	2025-07-09 01:12:51.697755	Sharjah	sharjah alshahba	{uploads/IMG_7235.jpeg,uploads/IMG_7237.jpeg,uploads/IMG_7238.jpeg,uploads/IMG_7239.jpeg}	uploads/thumbs/thumb_IMG_7235.jpeg	\N
101	114	12	Rayees Mossa Electrician	• Service Type: Electrical, plumbing, carpenter,\r\n• Service Area: Sharjah \r\n• Experience Level: Expert\r\n• Availability: 24/6	100.00	\N	pending	2025-07-10 03:40:14.317407	Sharjah	Al majaz 	{uploads/1000454168.jpg}	uploads/thumbs/thumb_1000454168.jpg	\N
104	117	6	MSI 32’ Monitor	• Product Type: Monitor\r\n• Brand & Model: MSI\r\n• Condition: Like New\r\n• Storage: 0\r\n• Screen Size: 32 \r\n• Warranty: No\r\n• Accessories:	600.00	\N	pending	2025-07-10 17:53:57.691108	Dubai	Dubai Land	{uploads/IMG_4718.jpeg,uploads/IMG_4716.jpeg}	uploads/thumbs/thumb_IMG_4718.jpeg	\N
107	115	6	Hoguo Powerbank 10000 MAH	• Product Type: Powerbank\r\n• Brand & Model: Hoguo P08\r\n• Condition: New\r\n• Storage: 10000\r\n• Screen Size: NA\r\n• Warranty: Yes\r\n• Accessories:	45.00	\N	pending	2025-07-12 11:51:01.410514	Dubai	Al Murar	{uploads/image.jpg}	uploads/thumbs/thumb_image.jpg	\N
108	115	6	Xiaomi Smart Camera C700	• Product Type: Camera - CCTV\r\n• Brand & Model: Xiaomi C700\r\n• Condition: New\r\n• Storage: 256GB\r\n• Screen Size: NA\r\n• Warranty: Yes\r\n• Accessories: NA	155.00	\N	pending	2025-07-12 11:54:28.283824	Dubai	Al Murar	{uploads/IMG_6066.jpeg}	uploads/thumbs/thumb_IMG_6066.jpeg	\N
109	115	6	TP-Link Router AC1350 	• Product Type: Router\r\n• Brand & Model: TP LINK AC1350\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	85.00	\N	pending	2025-07-12 11:57:44.788591	Dubai	Al Murar	{uploads/IMG_6068.jpeg}	uploads/thumbs/thumb_IMG_6068.jpeg	\N
110	115	6	MI TV Stick	• Product Type: TV Stick\r\n• Brand & Model: Android TV\r\n• Condition: \r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	105.00	\N	pending	2025-07-12 12:00:33.655284	Dubai	Al Murar	{uploads/IMG_6069.jpeg}	uploads/thumbs/thumb_IMG_6069.jpeg	\N
111	115	6	Goui Powerbank	• Product Type: Powerbank\r\n• Brand & Model: Goui Singi 20\r\n• Condition: New\r\n• Storage: 20000\r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	60.00	\N	pending	2025-07-12 12:03:37.615548	Dubai	Al Murar	{uploads/IMG_6070.jpeg}	uploads/thumbs/thumb_IMG_6070.jpeg	\N
113	115	6	Airpods Pro 2nd Generation 	• Product Type: Airpods \r\n• Brand & Model: Apple Airpods 2nd Gen\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	650.00	\N	pending	2025-07-12 12:07:52.133462	Dubai	Al Murar	{uploads/IMG_6072.webp}	uploads/thumbs/thumb_IMG_6072.webp	\N
114	115	6	Belkin Wireless Charger	• Product Type: Wireless Charger\r\n• Brand & Model: Belkin 3-in-1\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	415.00	\N	pending	2025-07-12 12:11:16.976436	Dubai	Al Murar	{uploads/IMG_6073.jpeg}	uploads/thumbs/thumb_IMG_6073.jpeg	\N
115	115	10	Labubu - Have a seat (copy)	• Item Type: Labubu\r\n• Age Range: Any Age\r\n• Condition: New\r\n• Brand: Labubu\r\n• Material: Fur	15.00	\N	pending	2025-07-12 12:17:56.908461	Dubai	Al Murar	{uploads/IMG_6074.jpeg,uploads/IMG_6075.jpeg}	uploads/thumbs/thumb_IMG_6074.jpeg	\N
116	115	10	Labubu - Biginto Energy (copy)	• Item Type: Labubu\r\n• Age Range: Any Age\r\n• Condition: New\r\n• Brand: Labubu\r\n• Material: Fur	15.00	\N	pending	2025-07-12 12:20:24.75907	Dubai	Al Murar	{uploads/IMG_6076.jpeg,uploads/IMG_6077.jpeg}	uploads/thumbs/thumb_IMG_6076.jpeg	\N
117	115	6	Goui Cube	• Product Type: Powerbank\r\n• Brand & Model: Goui Cube QI\r\n• Condition: New\r\n• Storage: 10000 MAH\r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	55.00	\N	pending	2025-07-12 12:28:17.084957	Dubai	Al Murar	{uploads/IMG_6078.jpeg}	uploads/thumbs/thumb_IMG_6078.jpeg	\N
118	115	6	USB-C To lightning	• Product Type: Charger\r\n• Brand & Model: Apple USB-C to lightning\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories: Charger	90.00	\N	pending	2025-07-12 12:31:35.19553	Dubai	Al Murar	{uploads/IMG_6079.jpeg}	uploads/thumbs/thumb_IMG_6079.jpeg	\N
119	115	6	USB-C to C Charger	• Product Type: Charger\r\n• Brand & Model: Apple \r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories: Charger	85.00	\N	pending	2025-07-12 12:32:21.383709	Dubai	Al Murar	{uploads/IMG_6080.jpeg}	uploads/thumbs/thumb_IMG_6080.jpeg	\N
120	115	6	Apple Air Tag 1 PC	• Product Type: Charger\r\n• Brand & Model: Apple\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	95.00	\N	pending	2025-07-12 12:35:00.275728	Dubai	Al Murar	{uploads/IMG_6081.png}	uploads/thumbs/thumb_IMG_6081.png	\N
121	115	18	Labubu Key Chains	• Item Type: Keychain\r\n• Usage: New\r\n• Brand (if any): Labubu	15.00	\N	pending	2025-07-12 12:51:06.297425	Dubai	Al Murar	{uploads/IMG_6084.jpeg,uploads/IMG_6085.jpeg,uploads/IMG_6086.jpeg,uploads/IMG_6087.jpeg,uploads/IMG_6090.jpeg}	uploads/thumbs/thumb_IMG_6084.jpeg	\N
122	115	6	Tp link Wifi range extender	• Product Type: Extender\r\n• Brand & Model: TpLink Ac2600\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	250.00	\N	pending	2025-07-12 13:21:17.428865	Dubai	Al Murar	{uploads/IMG_6091.jpeg}	uploads/thumbs/thumb_IMG_6091.jpeg	\N
123	115	6	Sony Headphones 	• Product Type: Headphones\r\n• Brand & Model: Sony MDR-ZX110AP\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	35.00	\N	pending	2025-07-12 13:23:29.951672	Dubai	Al Murar	{uploads/IMG_6092.jpeg}	uploads/thumbs/thumb_IMG_6092.jpeg	\N
124	115	6	Xiaomi TV Box S	• Product Type: TV Box\r\n• Brand & Model: Xiaomi\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	160.00	\N	pending	2025-07-12 13:42:15.345678	Dubai	Al Murar	{uploads/36b792b1-3980-443c-a324-b2b22158ecb7.jpeg}	uploads/thumbs/thumb_36b792b1-3980-443c-a324-b2b22158ecb7.jpeg	\N
125	115	6	DJI Osmo 7	• Product Type: Dji Osmo\r\n• Brand & Model: Dji Osmo Mobile 7 \r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	270.00	\N	pending	2025-07-12 13:45:09.439057	Dubai	Al Murar	{uploads/c15da00d-1083-4414-b21e-dac9e82d13d5.jpeg}	uploads/thumbs/thumb_c15da00d-1083-4414-b21e-dac9e82d13d5.jpeg	\N
126	115	6	DJI Osmo Mobile 7 Plus	• Product Type: Dji Osmo Mobile 7 Plus\r\n• Brand & Model: DJI\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	430.00	\N	pending	2025-07-12 13:46:55.447139	Dubai	Al Murar 	{uploads/2b1a7393-466f-4b98-adf7-bad10be7f24e.jpeg}	uploads/thumbs/thumb_2b1a7393-466f-4b98-adf7-bad10be7f24e.jpeg	\N
127	115	7	Xiaomi Smart Air Fryer	• Product Type: Air Fryer\r\n• Brand: Xiaomi\r\n• Condition: New\r\n• Energy Rating: \r\n• Color: White - Black\r\n• Size / Capacity: 6.5L\r\n• Warranty: Yes	250.00	\N	pending	2025-07-12 13:59:07.377108	Dubai	Al Murar	{uploads/dd4b3320-13f2-4193-8742-1bc8e7681485.jpeg}	uploads/thumbs/thumb_dd4b3320-13f2-4193-8742-1bc8e7681485.jpeg	\N
128	115	6	Xiaomi Vacuum Cleaner	• Product Type: Vacuum\r\n• Brand & Model: Xiaomi Vacuum G20 MAX\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	650.00	\N	pending	2025-07-12 14:00:24.884103	Dubai	Al Murar	{uploads/47d1478d-bc8b-4c45-a8cc-724e691a7c38.jpeg}	uploads/thumbs/thumb_47d1478d-bc8b-4c45-a8cc-724e691a7c38.jpeg	\N
129	115	6	Xiaomi Vacuum Lite	• Product Type: Vacuum\r\n• Brand & Model: Xiaomi \r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	250.00	\N	pending	2025-07-12 14:01:17.404524	Dubai	Al Murar	{uploads/b5fa05b8-21b5-4919-94c3-32c94371bad8.jpeg}	uploads/thumbs/thumb_b5fa05b8-21b5-4919-94c3-32c94371bad8.jpeg	\N
130	115	6	Xiaomi Robot Vacuum	• Product Type: Vacuum\r\n• Brand & Model: Xiaomi robot E10C\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	360.00	\N	pending	2025-07-12 14:02:37.459444	Dubai	Al Murar	{uploads/ef3cd027-a967-451d-8b65-aa3d774b9a95.jpeg}	uploads/thumbs/thumb_ef3cd027-a967-451d-8b65-aa3d774b9a95.jpeg	\N
131	115	6	Insta 360 X5 Camera	• Product Type: Insta 360 Cam\r\n• Brand & Model: Insta360 X5 8K Action Cam\r\n• Condition: \r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	1770.00	\N	pending	2025-07-12 14:28:40.972684	Dubai	Al Murar	{uploads/IMG_6100.jpeg}	uploads/thumbs/thumb_IMG_6100.jpeg	\N
132	115	6	Whoop Life	• Product Type: Whoop watch\r\n• Brand & Model: Whoop life\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories: Wireless Powerpack	1370.00	\N	pending	2025-07-12 14:29:56.059703	Dubai	Al Murar	{uploads/IMG_6101.jpeg}	uploads/thumbs/thumb_IMG_6101.jpeg	\N
133	115	6	DJI Osmo Pocket 3	• Product Type: Camera\r\n• Brand & Model: Osmo pocket 3 Creator combo\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	2270.00	\N	pending	2025-07-12 14:31:19.314871	Dubai	Al Murar	{uploads/IMG_6102.jpeg}	uploads/thumbs/thumb_IMG_6102.jpeg	\N
134	115	6	Hollyland Lark M25 Wireless Microphone 	• Product Type: Wireless Microphone \r\n• Brand & Model: Hollyland Lark m25\r\n• Condition: \r\n• Storage: \r\n• Screen Size: \r\n• Warranty: \r\n• Accessories:	340.00	\N	pending	2025-07-12 14:32:33.562963	Dubai	Al Murar	{uploads/IMG_6103.jpeg}	uploads/thumbs/thumb_IMG_6103.jpeg	\N
135	115	6	DJI Mic 2 	• Product Type: Wireless mic\r\n• Brand & Model: Dji mic 2\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	850.00	\N	pending	2025-07-12 14:33:44.031711	Dubai	Al Murar	{uploads/IMG_6104.jpeg}	uploads/thumbs/thumb_IMG_6104.jpeg	\N
136	115	6	DJI Mic Mini	• Product Type: Wireless mic\r\n• Brand & Model: Dji mic mini\r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	450.00	\N	pending	2025-07-12 14:34:57.220213	Dubai	Al Murar	{uploads/IMG_6105.jpeg}	uploads/thumbs/thumb_IMG_6105.jpeg	\N
137	115	6	GoPro 13 Black	• Product Type: Camera\r\n• Brand & Model: Gopro 13 black \r\n• Condition: New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: Yes\r\n• Accessories:	1100.00	\N	pending	2025-07-12 14:36:41.291538	Dubai	Al Murar	{uploads/IMG_6107.jpeg}	uploads/thumbs/thumb_IMG_6107.jpeg	\N
138	121	4	Jaguar XF 2012 V6 Full Option GCC Specs	• Make & Model: Jaguar XF\r\n• Year: 2012\r\n• KM Driven: 190000\r\n• Body Type: Sedan\r\n• Doors: 4\r\n• Transmission: Automatic\r\n• Fuel Type: Petrol\r\n• Color: Grey Beige\r\n• Previous Owners: 2\r\n• Service History: Full\r\n• Warranty: No\r\n• Accident History: Minor	14000.00	\N	pending	2025-07-13 07:14:14.291832	Dubai	Dubai	{uploads/IMG_5017.jpeg,uploads/IMG_5024.jpeg,uploads/IMG_5025.jpeg,uploads/IMG_5027.png,uploads/IMG_5026.jpeg}	uploads/thumbs/thumb_IMG_5017.jpeg	\N
139	123	6	Collection of PlayStation 4 Video Games	• Product Type: CD\r\n• Brand & Model: Playstation 4 CD\r\n• Condition: Like New\r\n• Storage: \r\n• Screen Size: \r\n• Warranty: No\r\n• Accessories:	200.00	\N	pending	2025-07-14 09:29:14.629777	Dubai	Dubai Silicon Oasis	{uploads/IMG_7725.jpeg,uploads/IMG_7727.jpeg}	uploads/thumbs/thumb_IMG_7725.jpeg	\N
141	138	18	Rolex Panda	• Item Type: Watch\r\n• Usage: New\r\n• Brand (if any): Rolex	125000.00	\N	pending	2025-07-16 11:26:32.79074	Dubai	Dubai	{uploads/fbd89ea3-d00d-4d17-8d71-2b0bfe2a4ec3.jpeg}	uploads/thumbs/thumb_fbd89ea3-d00d-4d17-8d71-2b0bfe2a4ec3.jpeg	\N
142	138	18	Rolex Pepsi 2025	• Item Type: Watch\r\n• Usage: New\r\n• Brand (if any): Rolex	86000.00	\N	pending	2025-07-16 11:27:57.145082	Dubai	Dubai	{uploads/IMG_6771.jpeg}	uploads/thumbs/thumb_IMG_6771.jpeg	\N
\.


--
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.packages (id, name, price, max_listings) FROM stdin;
1	DEALIFY ONE	10.00	1
2	DEALIFY THREE	27.00	3
3	DEALIFY SIX	51.00	6
4	DEALIFY TWELVE	96.00	12
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, listing_id, reason, created_at) FROM stdin;
3	52	Spam or misleading	2025-06-29 23:07:00.541397
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales (id, buyer_id, seller_id, listing_id, price, sale_date) FROM stdin;
\.


--
-- Data for Name: subcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subcategories (id, name, category_id) FROM stdin;
1	Land	1
2	Office	1
3	Penthouse	1
4	Villa	1
5	Apartment	1
6	Room	2
7	Office	2
8	Villa	2
9	Apartment	2
10	Classic	4
11	Electric	4
12	Convertible	4
13	Truck	4
14	SUV	4
15	Sedan	4
16	Scooter	5
17	Touring	5
18	Cruiser	5
19	Sport	5
20	Appliances	6
21	Wearables	6
22	Audio Devices	6
23	TVs	6
24	Cameras	6
25	Gaming Consoles	6
26	Tablets	6
27	Laptops	6
28	Mobiles	6
29	Accessories	8
30	Shoes	8
31	Suits	8
32	Jeans	8
33	Shirts	8
34	T-Shirts	8
35	Accessories	9
36	Handbags	9
37	Shoes	9
38	Jeans	9
39	Skirts	9
40	Tops	9
41	Dresses	9
42	Sailing Boat	21
43	Jet Ski	21
44	Fishing Boat	21
45	Yacht	21
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, phone, role, created_at, city, listings_count, package_id, avatar) FROM stdin;
85	Ahmad 	ahmadabubakr1705@gmail.com	scrypt:32768:8:1$SxwzahvWMhvrenOD$a742a7917cc070af509169026aec48e23d2d11d561bcdcdf3d0b3bf80825d6d70661125ee1afc93727a3fd1a66ba08b5c1c66c332e9016f3e71b57de7b319c60	0544471229	buyer	2025-07-05 04:22:07.025624	Dubai	6.00	\N	\N
86	moustafa	moustafahussein2007@gmail.com	scrypt:32768:8:1$4lkguKaiosCK6Ele$519e56993d2a761216357fc9dc36b60c37a49d43f0beb903813a550831cbb1b39929d95900c1942a48f12725afd0c4bc05f37d0a4730911117497a1658cc13f7	0543336001	buyer	2025-07-05 05:13:26.970268	Dubai	6.00	\N	\N
87	Ahmad	momotg2002@gmail.com	scrypt:32768:8:1$6Qi8fbKsCgdM9Jv1$b069ffdb697f42974a7dc1dd8a675a52ac1149505a434eb5b0197f7c30d69ccc63c2b71c7dcd285e32796e9ad85592ed88b153e961a70471a3107021bdef4b5f	0502325953	buyer	2025-07-05 05:14:23.192639	Dubai	6.00	\N	\N
12	Fadi Mohchieh	fadimohchieh@gmail.com	scrypt:32768:8:1$gNItmu69WaYqjX2R$81eb8f38872e5113d4bdbd1083a22952e8bd289fc596d86dbc19b1faa8b10d2b6c7f8fb7bb528bdedc05023bca0f3c4aeb5f1fc18a0a0b8efd700fe64f4c5c96	0505534350	buyer	2025-05-29 22:17:57.687504	\N	200.00	\N	user_12_avatar.jpg
35	Ahmed Tadjine	aatadjine@gmail.com	scrypt:32768:8:1$zkXYciQWrrmGbkEJ$52fb172b161a02d66619eb4a63ba88bf6b593aa04ad642333ff9e39ee787a0744bfe977b391b5c78d0602b2dbe97e5c5aa4922ce2a2fd9e406e816e6be1997a8	0524216163	buyer	2025-06-27 11:20:48.785498	Dubai	5.00	\N	\N
16	hydr	hydr@gmail.com	scrypt:32768:8:1$T5lcc0REkqaiXNJV$19acdc373d6f4a76303bf17835589d7aa0a6e5fee0d8ab490a3b9c98260ff9280dae2256f54d57b575e7d4b6c915130b91b772c2e35909c623015f7644c7de93	0515553214	admin	2025-06-19 08:54:47.879947	\N	6910.00	\N	\N
42	Basel	baselmajed@hotmail.com	scrypt:32768:8:1$JqVoVTEAoScrPByp$713f27d0404c07a0425b1e528c4f0c93854cfa88a2ebd0a5adc51c56a7cf6181d4b7d633f2a41578411d68827c6330af802b2aded1976645ef55e564a889cc89	0553580058	buyer	2025-06-28 15:04:58.801839	Dubai	6.00	\N	\N
40	TOP BOY	topb99410@gmail.com	scrypt:32768:8:1$aWDtKnx88cklMbPm$c60693dcb7b3c5da8804b96bb71a6837db8adbfebb93b7fa39b486178f8ccef89cc0b35c4538902651efd589e1c98c3f678e6916eb207afcc011dd1498e4f11c	0502586631	buyer	2025-06-28 02:52:35.417078	Dubai	5.50	\N	\N
62	Sara d	sfmd0551@gmail.com	scrypt:32768:8:1$2BaYUTtuzUVQkOmL$49dd0e49ac9452c0659f7604e65910b55dd369627b5d0eb48a223192fb5d9e1b7afcdc8938836a68fea15aac7fde012d6d7143c8ca736d48264f6665d9f558fa	0545858233	buyer	2025-06-30 14:32:10.811118	Dubai	6.00	\N	\N
65	Malak ahmed	mala64921@gmail.com	scrypt:32768:8:1$oKtaM43zShfpW6vZ$f5eee5d1b58ebe7fc67fa77a6776b2a504a7c3394191ba900326f02345ad452ef22d56350709af6116a47242006bc1e0523fd89e2c813ed0edc1bfa9cff48a20	0501818215	buyer	2025-06-30 19:50:13.706463	Dubai	6.00	\N	\N
34	Rawan Al Azhari	rawan_mehjazi@hotmail.com	scrypt:32768:8:1$HhShZztlsbsUGu47$87a63f5900a12ada8f440446ec2a77ed7d477d0c4cab38c07ef952e48c0542bd4201eefa15bbb2f55aa9cd6fbf8054f1af6e1b181da863b1a0fa3fa5db87ac63	0503060888	buyer	2025-06-27 09:41:40.643912	Sharjah	45.00	\N	\N
41	apple	applereview@dealify.ae	scrypt:32768:8:1$zGPC8nQ9DZTVibyg$0c513e7123b61acf0126206026fdf1c7ba63f47438dd5d3506fb2b9618f5c4a028463a6494ef4727b588712d6096de598f43da045cc77da57921c69601748c9c	0512345678	buyer	2025-06-28 12:49:10.966038	Dubai	6.00	\N	\N
30	rasha	rashaturaify726@gmail.com	scrypt:32768:8:1$PTRqbFdjMlTaSp2O$03f1dbfb0bc65ee9f10a0ca3064a26e8c7105af87b046a48441d358ca35c10f1800aa7a1e5e35273e553f201f671c97c8c0eb3f6d6fc767813ed487e005f7e78	0501234567	buyer	2025-06-26 08:40:34.830924	\N	45.00	\N	\N
36	abdul rahman	abdulbuhaisi2005@gmail.com	scrypt:32768:8:1$EOmM6uCZjwatkK2f$4a995377b24894e48d787001cebc1a122296c97734584e14ad192a7b257a5b98fbc317812fd20764c9732d22f6022535db78c12b390824fe0352e74bb984958a	0528945257	buyer	2025-06-27 12:55:20.443257	Sharjah	6.00	\N	\N
69	Batoul	batoulmostafa2222@gmail.com	scrypt:32768:8:1$jQ27KQM6jQQnbBQ8$2c6c1cbd3ad193b329861cb39847dbe22a4cb1cb76e6e3f56709994ddf728b3cd030577faf1311cd4d35985bf21bcc08bcb130dbf3c848ecc821bb35587a136c	0505995470	buyer	2025-07-02 18:11:35.72137	Sharjah	6.00	\N	\N
29	User	user@domain.com	scrypt:32768:8:1$gmomrHW2aUWbtwu0$b3ce0ab16555ef048e8e89d7d7ecce23a1fe547702ec0c01e208f23b4bf9bf32593e9a84cda898fa9a1bc13466c4876754fea8694275ca4d078e4bf6f87ad733	0523334444	buyer	2025-06-26 08:35:19.651135	\N	6.00	\N	\N
44	Aboud	abd.tizini@hotmail.com	scrypt:32768:8:1$ejKReUIqNzi8T17M$00fd6207d1b1b9023785ca1edcb8ab1a170ce1ad75f8d8447b85972aa4dd7a1a3427d05600e06f6c532fdec550d5f5758b88ea6f7e4bcbbc508cf3365b8d5bd1	0529254949	buyer	2025-06-28 17:27:28.637816	Dubai	6.00	\N	\N
46	Tameem Khalaf	tameemkhalaf2006@gmail.com	scrypt:32768:8:1$gdG4vFazoTPDW8Rl$866db191511c8cc10bd0a041517f7076915e80580ff281972dcf5fb1adcc90834b452ea1fb5151788a640acbac09d1770259550bc9aaa7b2a64c1284a526393b	0505606414	buyer	2025-06-29 15:05:58.590861	Sharjah	6.00	\N	\N
60	Seleen muwafi	seleenmuwafi2@gmail.com	scrypt:32768:8:1$9zbwbiGSUfPLtrRx$147164a2d534dbdf3b1b7582a38c9e761a351e3f78d16418aaf0eddb468ce002c68b2a463ad92ecd0b5e7338d831f8ec00ae4e309d31dc4a1666c86961060f29	0564953489	buyer	2025-06-30 05:24:20.923339	Dubai	6.00	\N	\N
66	Abdulla Saeed Almarri	abdullaalmarri324@gmail.com	scrypt:32768:8:1$AuOk3yqQp60UGsBa$e8226533c5f70fc5a5d8df50f5ca3883992eece8924a54f4deec4a0643af41b31480111b4ba6eefa978901484b8b55fd644ada2fb2ea4e44ba94b52b7d67abf4	0544322227	buyer	2025-07-01 12:41:17.081132	Dubai	5.50	\N	\N
67	saif	saifmchieh@gmail.com	scrypt:32768:8:1$n8cWjFNrhroTq83a$e008704bee4df5ea1027c9a66e6e2304d07ea32bcfe492c4fcc305bd8eb62c6d73b338b0a8e6cae3be3010b39bc02a1d814cc7658a7e3baa80c0fb2f8865b1f2	0521026024	buyer	2025-07-01 12:48:35.466776	Sharjah	6.00	\N	\N
45	Yazan Ghawi	yazanghawi6@gmail.com	scrypt:32768:8:1$HwrPlfTtoBdvHT9M$f0a4dfbad330550bbf89ecd8c6ba781aedf1ff86e82858515f26a2a605d10d0303ae6480969c8355e5b50ad5b29861665ba011c6f9b111d9687b5392f5b826d7	0585039333	buyer	2025-06-28 20:04:47.491638	Dubai	15.50	\N	user_45_avatar.jpg
64	 Nour Aldin	mevinetubehd@gmail.com	scrypt:32768:8:1$VGxFpJd5Sdru1HH8$8aa2abd7a0affb0001cc707d9b37c44b6326ded4e2b0da3a382acfb2a821cc6e9595c532d5f612cf4ba9ffbbdb7eeaddfa4cecd030247ca68f02891bda92b2d4	0555534350	buyer	2025-06-30 17:28:50.935417	Dubai	43.00	\N	user_64_avatar.jpg
70	Walid Al Azhari	walid.azhari@hotmail.com	scrypt:32768:8:1$ePGMnAOnFpFaXgRK$ba6aade49f0ea811ada16af2bbdb3c48277358476293ed2705f74cd1b7104729f2c574ff324496d2075039c7c15692e8991794f85a0259c0b74a0d4dea66c0c1	0502008455	buyer	2025-07-02 20:58:11.759769	Sharjah	6.00	\N	\N
68	karim	karimaz12233444@gmail.com	scrypt:32768:8:1$9sKroYubQsQO2AMb$567adac675993ba9569c374cf3102b4edb841e5afc64785fc2e31f16bdd4cba3d1f1701543a706fae7a7fede6d02035026aefed8790f29b92466ae60ee510685	0507088950	buyer	2025-07-01 15:31:31.188141	Dubai	5.00	\N	\N
89	Mustafa	alrubaiy.mustafa10@gmail.com	scrypt:32768:8:1$4rLr3NTk54zc7R4e$dd8211d6bf14d217cab695c5383931e5d54eb2768184441b9255896dede078aa6737aadfffca48fea035421016d92185f6a582a3564f31651241e242a53518d4	0566321447	buyer	2025-07-05 09:54:55.972903	Sharjah	6.00	\N	\N
72	joud	joudkadoura3@gmail.com	scrypt:32768:8:1$IIdRc2z5ntNEcwXP$d740a3de9943b62718b7e983c0ea784590f6606e9ec37b27e56877d1eab1d10e1c8578062f6c1f99864fed3c82e7d43bc5316ef0a0e83d1cf3dc4589e58408f0	0562641110	buyer	2025-07-03 18:05:17.012822	Dubai	6.00	\N	\N
90	Gigi	isgina2006@outlook.com	scrypt:32768:8:1$o1z2KbRtoPQ3XBth$be7c4ca61cebedc42d8fdeb503a8f7c6dab7976e4ae6ddb886e7d6198be9c63dceb46a6b9e5334d02c9393b30057f8351f62db2bb77ebc2cbe4a7fb85d27af24	0505224610	buyer	2025-07-05 10:41:26.64709	Dubai	6.00	\N	\N
74	reina maarouf 	maaroufreina@gmail.com	scrypt:32768:8:1$5489eVmoezYobE7U$b8975f3bb5a954bb3ae044ff56cd38842a1a065050f48e12cd361cc23ed033203f49c1ec9b81d9c4ce0f070afcebcc40018c5364f1a21731cb9ed9fcfa9075f2	0504089810	buyer	2025-07-03 18:08:53.402206	Sharjah	6.00	\N	\N
91	Alaa Al zein	alzein086@gmail.com	scrypt:32768:8:1$sXggVCGFzKR76TcY$96d0f357a886d01a4b07ea0bca5acd6606baf10b60a26931954d71685be61b62fac3f29c924eb4ed48c5aaec5a059a7e83fd2d41d054ecfa0c209b5b5512fae2	0507872033	buyer	2025-07-05 10:56:05.593806	Sharjah	6.00	\N	\N
92	Mohamed Alali 	alali.uae434@gmail.com	scrypt:32768:8:1$HaltnDJHPInrUU61$6078fa0dcef948441cc82c46463320b9e78825426874078e3115f55c9b4caf9cb60da1bbe1b9da651a29a9387dbc39d75b82521c04cb7ae1e5f6808a4c976a54	0545646555	buyer	2025-07-05 11:03:54.389363	Umm Al Quwain	6.00	\N	\N
93	Aya Bachhamba 	aya.bachhamba@gmail.com	scrypt:32768:8:1$OTJCQ4yPxEwj8k84$794f96439d058c085f9a857293b7772c215b36d939da8f09d061860a918de030d8d7251c0a855d3340be15ff4a31a08dcd75b1176fbac4aef5ec7b5dee5e51c2	0553955913	buyer	2025-07-05 13:36:31.501512	Dubai	6.00	\N	\N
75	Menna	abdallamenna1@gmail.com	scrypt:32768:8:1$GH7WZaOzpULHLNBW$33cba936cab5713f21c2fa26ab42f03c52a72b6c6b0fd62969e93f6bbfca4961b4a70b83ee6011c746458c8954633f17c71e0da3c255d0880a916eed459aff46	0501719550	buyer	2025-07-04 08:25:12.538099	Sharjah	6.00	\N	\N
77	Taj aldeen	tajaldin320@gmail.com	scrypt:32768:8:1$AiOE0QLtjoVpPfh4$15e0e864530250650d7e6729a70f3a13bb467f68fab90f4d74ff75bd4848448966df2659df3bb4c7d7d94c11ac5d5378e6d689b16f3ee39e1464a05d9417c7e6	0528552828	buyer	2025-07-04 09:52:26.269799	Sharjah	6.00	\N	\N
78	Loma	lomaaboulhosn355@gmail.com	scrypt:32768:8:1$srEtxsSh3QbGCmLv$dd6d92a1459650f8e7fdaa56aea3a2ed3eea5b48a2f6b0f9b71c2c2b437c43145668364582519b8737705d7165654302277473fe1bcf5664369a35e8cfc8e8de	0508361736	buyer	2025-07-04 19:17:15.0781	Dubai	6.00	\N	\N
79	sara	rana-hajir@hotmail.com	scrypt:32768:8:1$Cgp8frnbTWev7BiG$bba005f4be1332b19371e6164103914b4583edb0e02fd2296805ad1c114bcefe9e3c2b9c729d11a221946e2949c30c3ef6224ece5ef0466f78f866bc6274d3fb	0562641113	buyer	2025-07-04 20:54:15.814611	Dubai	6.00	\N	\N
113	hussain alrubaiy	hussainalrubaiy6@gmail.com	scrypt:32768:8:1$4TgGDB9sGptfvomt$8c5c06f670163c40296f3165fbe81f916242e4cb861caf044c306356edcc301ce05b696f55ecee0fcd12d94eec75d3c9a349edc503614a0275bccfebb2085875	0507391810	buyer	2025-07-09 01:07:12.399772	Sharjah	5.50	\N	\N
81	saif hathboor	saifhathboor31@gmail.com	scrypt:32768:8:1$7nqz2ityDXqBmGGi$6bd47cf259b950fb7a6134251ec208cdac97236082be29348167bf46f1124be057e87f0166f9db6b9ebabf45a9d2af3d913d6a1cde31c77ceb00b8cb319d8b59	0556455055	buyer	2025-07-04 22:54:56.93598	Dubai	6.00	\N	\N
82	Kareem 	abusalahkareem3@gmail.com	scrypt:32768:8:1$EaLBy98uAZ7ENF0v$c1e52f8234b564a3983a08a33c23857317aa99ac7f4988bc73eda9bf30f9f76bd7242684ac67726e3f45d1418c0b57435ad1904729a1015f6b2cde020c84f44d	0521869778	buyer	2025-07-04 22:55:38.125496	Dubai	6.00	\N	\N
96	Srikrishna 	srikrishnavanam@gmail.com	scrypt:32768:8:1$l9GR9fpiSCFoXZOr$bb9a8b15199fc2f8a34ebfe2b02cdf7fa6465d279ca5a5bfb0ae8e61bc533963bd173e2345eaac2e0d4aeea05a74944c732681b206a907a86065ad3ff7e0a584	0557971564	buyer	2025-07-06 06:59:51.883373	Dubai	5.50	\N	\N
88	Nour	mocattashnour@gmail.com	scrypt:32768:8:1$E8xG0Vr1FDTrYWH7$d5d97c98ac653bf64364f7f03cab721c7d36d00c21c7b4949752afa13600611b0197c2ffefdbf5c2fe46ca01b48e9f5ac3ac08f51aebb9555862fd937dd0c4c4	0543225818	buyer	2025-07-05 09:25:31.898877	Dubai	6.00	\N	\N
43	Omar	omarhamour75@gmail.com	scrypt:32768:8:1$3hPrppEwynnSNK8m$1aad770bb39c07ca437b402ac8745aacaf822b8745d10eca518a657be24c767aeace17bd1901d6856920555f2b0e936d16d7afeffe10089710a2a24a2e671cd6	0502531301	buyer	2025-06-28 16:10:18.535045	Dubai	42.00	\N	\N
97	Aziz 	zizoshiddo77@gmail.com	scrypt:32768:8:1$UPhWNhqIoSbjMri4$bd8ee2d3b2b29fc6f6a481063f703649b68fc1fe74a3fdcf802152d87b811f11c43cb0611493c20ca401d1c197bcf2dd3752e1c4693c7dff0d1487c54281ca4e	0558166598	buyer	2025-07-06 17:03:12.22505	Dubai	40.00	\N	\N
99	Layana Dalati	layanadalati@gmail.com	scrypt:32768:8:1$OPulXx5Mg1upfBOE$086a3e756785989149fff9c49d4db275b0e1fb335290bd1b91cc23ae4d5d379b7b40cbd143d2eeb14ae42528529ee8472ff77bdfd7f427d3041e4b3a9791d176	0555874855	buyer	2025-07-06 23:51:03.589954	Dubai	56.00	\N	\N
108	Farah 	farahaljaradat13@gmail.com	scrypt:32768:8:1$62r4tQb2v2HVyxLF$1a7d8c9192696175e98787594004bdcb2e68b064a91443600d7e14d12451e022491428cfc238deb8cdcbd2bceec64b737d4feefe0c9238f72cabb7aefa5bd379	0585901491	buyer	2025-07-07 18:19:49.28374	Abu Dhabi	6.00	\N	\N
80	Jawad	jawadtibi@gmail.com	scrypt:32768:8:1$9XNsmpRJXEQefhyX$c0cece7a7078c739b285dba7993c33faabcc31bc7547c84248b0a86c78bd094f118dcb04644ff61ef4cd25cadfe2fc97aa186f7085ade7a63cc78c90f3d444ed	0502616501	buyer	2025-07-04 22:39:56.239984	Dubai	5.50	\N	user_80_avatar.jpg
112	Naea Birkdar	naeabirkdar@gmail.com	scrypt:32768:8:1$c4f97lYEgiJuny7r$92ef45f139a3b84c42654a78a050285aebb0f9c152d38c156bdad7b626cde63a83f5d4ff55ae6c1a82f15c8d179baab6d5f029bc594618b7fb3ef1306b2fff40	0507516335	buyer	2025-07-09 00:31:31.794082	Dubai	6.00	\N	user_112_avatar.jpg
114	Rayees	ryzrayeez@gmail.com	scrypt:32768:8:1$a8bbSM5QR26YgOxg$c3897c502b3ecd2a18d8de1fbe54fa62a47d66c4b0289c88509363e53b7dd0efc0d1ae6a2e15ff0fdb3cc815f096fdd00d4e9a91fb1483fc78ff47ed82953936	0564537015	buyer	2025-07-09 17:19:10.710592	Sharjah	5.00	\N	user_114_avatar.jpg
116	dany ghazaleh	danyghazaleh7@gmail.com	scrypt:32768:8:1$i28QJNXcfEZ7mFUL$bcb69815761d1f20aeda25d6232f5ebee9475df0c16369a1e1b95a095f9b9b8cd17a155229da0cc60129e97f7235b0b525df0cfefdf52500d2a64bffd81c2c50	0569825484	buyer	2025-07-10 08:53:23.639202	Dubai	6.00	\N	\N
61	Dealify	admin@gmail.com	scrypt:32768:8:1$soXOWOhkKjq0wwSf$6a36835454d8aa95163d802c4fb14238840e109f9543ed7b6e986cb4a925f39340485241c65b2097557fc4cd1398e7b836cc0c199143d36d3100e581618c616e	0526006875	admin	2025-06-30 12:54:22.50579	Dubai	70.50	\N	user_61_avatar.jpg
117	ibrahim ibrahim 	kholio365@gmail.com	scrypt:32768:8:1$0TvpD9aX2vVaIYK3$e8183905c44d9157df611a5343ebcbb382a1b8ca81028657a366ec22a8346be899051f541f6df36a4470d4209b43124b75e1c45e590a99dc086feba2273b3725	0559393033	buyer	2025-07-10 17:52:38.740581	Dubai	5.50	\N	\N
118	AMER AZZAM	captamerazzam@gmail.com	scrypt:32768:8:1$pDevt13brhIZ6iCs$61c7c22e9f9865587c2b24d9bd1774186323d4c1ad77c342514f01f4ba7d34ff654fb2575bf1299a80bd13ee09ce3b9a5d4f3ed61a3a1e6c3b5ba17a336a9dae	0555557412	buyer	2025-07-10 18:05:09.311432	Dubai	6.00	\N	\N
119	Jana	queen_jana@icloud.com	scrypt:32768:8:1$yU9UTkt0OzfUsRc2$aa04f5e5834b92dd202f73ed74f33eba9e660f7ace46cbe9d837c30c55756f7a0e7760871922f5fa83428b97cde351a59f62d18be101a87e44e57fca9890ea17	0509719067	buyer	2025-07-11 01:18:07.065075	Sharjah	6.00	\N	\N
120	Molham dan	x5ct9twtty@privaterelay.appleid.com	scrypt:32768:8:1$foxXMTysHR5VPBcj$686d5dd6fb8e8718ce34a1dd7c8237a4bf899e5435000262fc586c012549a9c5021f08602aa1e4376f80f24b6a45fbc52146c14c0bdc069262f84bb78154b8e6	0566632448	buyer	2025-07-11 18:33:32.536065	Dubai	6.00	\N	\N
128	Sara	sara2006.n@icloud.com	scrypt:32768:8:1$EzLFFIkeXo2BqzX5$4f59c7512930ceff31236617fedfb4f604e5aabba3a3b34d134ccf8e17f603a5ccbac2403eb24949bc5a9f4007d6b5f6d05b7a7b4e434a66a641eeae4d2d4c0f	0509931840	buyer	2025-07-14 23:40:23.87346	Sharjah	6.00	\N	\N
129	Youssef Ariss	youssef.ariss.55@gmail.com	scrypt:32768:8:1$Z09WYW3Lx2hkZA9K$66ed74405ba015257ddcf94aaa8c43d5a095d581f1c45bceecbf3ac36a0143c451102945245739b9ec2ec874fccf3eb1f2b875728bd66e116809eab5319c2935	0501415344	buyer	2025-07-15 08:20:34.364647	Dubai	6.00	\N	\N
130	Eman	eman72006@gmail.com	scrypt:32768:8:1$bm6ZukfgT4bAvhOh$5f1a7320681aebe1291b5410d3c220a67a7eeb72ef5f4c4945060a58030867e096023a33eba7d6978834ac473d3713771ce194b0e59344531e2ad5b3d2741b70	0502481700	buyer	2025-07-15 23:21:11.30193	Dubai	6.00	\N	\N
131	Hajer Bashar Alkinani	hajer.kinani1@gmail.com	scrypt:32768:8:1$xIm5jK7OmCUGPGow$ae1c3a1eb0c0c5229dad5c80be63bb3bfb8c6cf4c90d561ce88535d7cfc73bd47935ea4bba396c3cac2fb67a1e287c393b71ce3e90dfcb77d28500f6ac3a0171	0508105358	buyer	2025-07-15 23:21:49.75223	Ajman	6.00	\N	\N
132	reena	reenajaradat73@gmail.com	scrypt:32768:8:1$7OMB7r0XH69Kkr0w$c95940dcee10e60ddb2f2d1ef41fdf179cdb5364fe7cba0ba7ec6ca4073110c02190c1062078215bd679603db8136b4da6f5fc0832524c90a92a7b2bee35876c	0543132132	buyer	2025-07-16 00:34:17.628438	Dubai	6.00	\N	\N
133	Elesar akram	elesarrtaffal@gmail.com	scrypt:32768:8:1$m1D9PE3MEqgtbcVY$97636c3011c826ced61eb10b232268fb72b9ed12007aad3a5752a184aa2a83a943228f6878abcccf456d9287f738942d6cb0a5f4750b955d43661ab996ea8b6e	0563925777	buyer	2025-07-16 01:04:28.368221	Dubai	6.00	\N	\N
134	Maya fares	mayafares20062007@gmail.com	scrypt:32768:8:1$LijcMWQCmEibXHv1$daa473d5f41db55c00583cf113cda5a8eb6721387a09d49132408871f40dd2aa3dbb70d20f3f052db5511ab0c4e52e472545d9a66d9f26c7986ba1d65e01f3cc	0548880424	buyer	2025-07-16 06:02:25.141098	Dubai	6.00	\N	\N
135	Shahd	kasajishahd@gmail.com	scrypt:32768:8:1$t4xkjp4z1EeJPph6$9f6485e851a54ce89d989bfc3e2ae1b77056ae8140d4819043fe5878b32078f87073fd8b4fa6658354eb263626e2652c3c51678f8793a6c892c314859db2a7d7	0552678010	buyer	2025-07-16 08:50:06.202709	Dubai	6.00	\N	\N
136	Lyna	lina_dje@hotmail.com	scrypt:32768:8:1$PB7odwcxAdKP3bIB$71ee4c7e936d1bee6412b8384ee845d8922158eba0036bf47aeec7a37075a994e9e6cf09852b69607ad097800d5397753280dfab91bd0b83286fa7cfe574d9e6	0562545470	buyer	2025-07-16 08:57:56.868589	Dubai	6.00	\N	\N
115	RTEL	rtelgeneral@yahoo.com	scrypt:32768:8:1$vJlBvUwaCoQZpQpc$bf24a303336dd9e14da215a50626730d30c0643d664a73a46746e0754541ba3377d5c3f9303159745e12bc775e9d6f0003d193d4801e978b54ca19e2a10d948b	0558535847	buyer	2025-07-09 22:49:33.418122	Dubai	190.00	\N	user_115_avatar.jpg
121	Mouhammed Alexandr Cheles	dx4pcym4wb@privaterelay.appleid.com	scrypt:32768:8:1$mOIvPcZC0zsxaU9B$de0fb5a0bcaa85eb220a5785a0ef890e04a5ca81e29653438a3167123224bbf86e5017ef290b67d270a7d4bbc1aaab32b7a33a43ab70725c9ddd083c72d6c76a	0582561718	buyer	2025-07-13 07:10:47.836195	Dubai	0.00	\N	\N
123	Khaled Khader	iikhaled5dr@gmail.com	scrypt:32768:8:1$QGE7c56k9SbYHEi5$fc03f1553ffc71ec98dbb168154caf9b0128a85c3a4add61ca7f066fea085e69c797a54bb03398634d634c02f954b9f55129821bea857b70530d04ce88322b2a	0501714640	buyer	2025-07-14 09:27:20.489474	Dubai	5.50	\N	\N
126	rasha daher	rashadaher3@icloud.com	scrypt:32768:8:1$0HTZOelSguOIKgII$0b3007bcf41d18e0caf858dd171d3bfd4c3626996cb8303f0a6f82f4a3ee48dd9c0541c39d1bdd7d96d64983d6fda9da7dd631c376707c6a48faa2b340d922d8	0564462053	buyer	2025-07-14 16:35:31.135231	Sharjah	6.00	\N	\N
127	Abodahmd	s2t5pcmdyn@privaterelay.appleid.com	scrypt:32768:8:1$yQQpBz64sHs3ym6O$ce200fbdfbfad296d5c3f29767251e5cc8300af78defedeac861c041d31fd1cb589d19aac3208ed113a84e90c452a2730e3b177e695e8a779bf24c63dcd36a1a	0503848041	buyer	2025-07-14 16:44:30.913793	Dubai	6.00	\N	\N
143	Hamza	muhammadhamza6142@gmail.com	scrypt:32768:8:1$zLyptTNLqhT1AYno$1d19668c2486c8bf5d7ccefc5cf2078e603bf09fb50d9705af9b1f063ca91a471fc97dec4ef86d172bafd221d4fcee60d36c1bb18f0ead2183e49e3cf4bea7d6	0507749926	buyer	2025-09-07 11:47:03.609999	Sharjah	5.50	\N	\N
138	Khalid	khalid.atout2004@gmail.com	scrypt:32768:8:1$rfXpGNtiQbSRe22t$32642eef5df01dc1009348a1847a93268080aab833c83b45de9fd149c0e0ea2af09d52d97fe43fd8937c09d5a109b53972325b78a0d62f85e9f32f180a92d14c	0568620043	buyer	2025-07-16 11:24:30.881311	Dubai	5.00	\N	\N
139	Sara sells	hibasotheracc@gmail.com	scrypt:32768:8:1$AnTyoxrWQpwa8tML$55131a2b257daf573e46b0d1477659fe1409ea72a411fccf9ba2cfa53a733824d3684dc92aa7514372d91f656b451721d23deab96c6282897468d7e465dcd956	0501498825	buyer	2025-08-15 20:35:20.414469	Dubai	6.00	\N	\N
140	Gafar	eshaangadgets608@gmail.com	scrypt:32768:8:1$oJLcbBqkApc31q2Q$a6fd1cb6d4b4c133fa9f8a02a888169685ba38ac901e1f0fd7b5cd65e89a28e41675114febb9e0da3c3f01e186bb6b858dc9b4481f31a3d0178a9e2767509367	0545718479	buyer	2025-08-20 11:58:43.872765	Dubai	4.00	\N	\N
144	Alma Ourabi	almousheh@icloud.com	scrypt:32768:8:1$KBC6YQQHEG3k6hQy$824f2dfe8cf1e35f3f81bbfdd96e639aa21ed9d5dd6ca233ad6eb26031d8c149e26036ba5fa6b252de2db1a811007da501a4462a80aa94f49ca672cf7366ef2f	0556996876	buyer	2025-09-10 13:17:39.359284	Dubai	6.00	\N	\N
141	mary.ramirez1569@gmail.com	mary.ramirez1569@gmail.com	scrypt:32768:8:1$z0SHbGWJYpnmBXBM$5918061102b9ebe8994c5cda57348c750c1e6a67f5311a92322491eb16683a767cd87c703a709a3a24c157c733f2fe8eba69b771cd972b8ffa7c1be174e0eda0	0551651651	buyer	2025-08-20 21:26:52.474668	Abu Dhabi	6.00	\N	\N
142	Jagtar Singh 	jassrajput67656@gmail.com	scrypt:32768:8:1$ScZ5GeejSZTl1tYv$82e40b83178e4b27c2c7e47593281a7af3aa56e2b67180e54b39db79dda744e834e28b0f1541075d86e9519c6ec7136ee366c5bfce54fb58a9fa2dc0e30a8141	0508502048	buyer	2025-09-01 05:46:27.686002	Dubai	6.00	\N	\N
145	Jayson Bonzon	bonzonjayson@gmail.com	scrypt:32768:8:1$mS00zQw13VxpHcCU$24c1a943b75da407cbddf17b0ed1ed1d2a1d11462f3c320c3445750d29a8447005a5f2349c5242a5a6e54ac6e348c5ea55854a6b0d9aad50c9de5e342d0b7e91	0526827501	buyer	2025-09-12 12:31:10.09027	Abu Dhabi	6.00	\N	\N
146	Zayed	x749bfvk47@privaterelay.appleid.com	scrypt:32768:8:1$AmdrKnKVzJB9V4x6$c8b218122440b2c6b158bfbf9b302612bb28aa07f1e3ed57b8455b1d994699b7dddc53988f975fca0afebb8d858712e598b25f9df858394bce1ab07a831079ce	0551703896	buyer	2025-09-28 12:39:32.348089	Sharjah	5.50	\N	\N
148	Muhammad Ali 	alimughalpbx9@gmail.com	scrypt:32768:8:1$oARCdNLKG9JXSLRL$7f053cc5e33decb102cd75ca8a71ce949c44de8adb7e610da5b5a6951b8086eda6f7d06012adb961dc7ad4aa868a5d3334838b811a752a98a38645c77cd1fa29	0547328165	buyer	2025-10-01 23:58:04.662031	Dubai	5.50	\N	\N
149	Ayesha khan	ak7245346@gmail.com	scrypt:32768:8:1$55odMataCeAzH06P$fe72b43c8f4e8db92e2fcd9064a8311fc69d5eb0897175f356d2209cf57eabf15b33d90051621da29b2c2c0216e462b490bf87f60a57c6df8dc4380150535a84	0501399837	buyer	2025-10-02 21:20:40.056916	Ajman	0.00	\N	\N
150	Onur turk	onurturk1987@hotmail.com	scrypt:32768:8:1$1MsMYMhVomx4c9fc$d6d17fe7cd641cd64998c1bbb920fc25e185414eaf5c4047af723eac42d15214348d31addf44d57827cbe1524d1d659c80c037b055f4478816d2d8240a4a803c	0581232034	buyer	2025-10-13 21:56:29.45359	Ajman	6.00	\N	\N
151	ETISALAT HOME WiFi 	eandetisalat.ae@gmail.com	scrypt:32768:8:1$ixKu5BNfHOjfseAs$57ede79e39d9ac5224c9b0bc19ef1d8d619b65d7faeef6132b004a5461f7816f5d517c4b2c6f1fa08f7090c60b057e89b012148ae724d86d3e6a8207ad79d605	0547561226	buyer	2025-10-23 19:31:50.052932	Dubai	5.50	\N	\N
152	MOHD KAIF	mdkaif14712788@gmail.com	scrypt:32768:8:1$KMAji1ULDNVzvgoP$a97cccd47b791537f1a21d3aab74b1ed73feb2ff2fbd4e6d5559a0d568b7307d00197a02eeb8b47e042d0a1a8932f9da780afd2c64a6dd79af8f09a6b81176d7	0561060625	buyer	2025-10-24 15:12:34.116279	Dubai	6.00	\N	\N
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 103, true);


--
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.listings_id_seq', 215, true);


--
-- Name: packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.packages_id_seq', 1, false);


--
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_id_seq', 3, true);


--
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_id_seq', 1, false);


--
-- Name: subcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subcategories_id_seq', 45, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 152, true);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (id);


--
-- Name: subcategories subcategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reports fk_listing; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT fk_listing FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: users fk_pid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_pid FOREIGN KEY (package_id) REFERENCES public.packages(id);


--
-- Name: listings listings_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: listings listings_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_package_id_fkey FOREIGN KEY (package_id) REFERENCES public.packages(id);


--
-- Name: listings listings_subcategory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id);


--
-- Name: listings listings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sales sales_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: sales sales_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: sales sales_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: subcategories subcategories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

