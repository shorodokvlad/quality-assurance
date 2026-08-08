<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/shorodokvlad/quality-assurance">
    <img src="assets/quality-assurance.png" alt="Quality Assurance Logo" width="80" height="80">
  </a>

<h3 align="center">FreeCodeCamp Quality Assurance Projects</h3>

  <p align="center">
    A comprehensive collection of 6 full-stack JavaScript & Node.js Quality Assurance applications and automated test suites.
    <br />
  </p>

</div>

<!-- ABOUT THE PROJECT -->
## About The Project

This repository contains a complete suite of Quality Assurance projects built for the FreeCodeCamp Quality Assurance Certification using **Node.js**, **Express**, **Mocha**, **Chai**, and **MongoDB**.

Each sub-application features a full-stack RESTful web service, an interactive frontend interface, and extensive unit & functional test coverage.

### Key Projects Included:

1. **Mocha-Chai**: Comprehensive unit and functional test runner examples using Mocha & Chai assertion library.
2. **Metric Imperial Converter**: Metric to Imperial measurement conversion API with unit and functional test validation.
3. **Issue Tracker**: Full-stack issue management system with CRUD endpoints, MongoDB filtering, and automated suite tests.
4. **Personal Library**: Book collection manager with comment features, MongoDB persistence, and full test suite.
5. **Sudoku Solver**: Sudoku grid solver algorithm, string validator, and interactive UI with unit & functional test validation.
6. **American British Translator**: Bi-directional American/British spelling, vocabulary, and title translation engine.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![NodeJS][NodeJS-shield]][NodeJS-url]
* [![ExpressJS][ExpressJS-shield]][ExpressJS-url]
* [![Mocha][Mocha-shield]][Mocha-url]
* [![Chai][Chai-shield]][Chai-url]
* [![MongoDB][MongoDB-shield]][MongoDB-url]
* [![JavaScript][JavaScript-shield]][JavaScript-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Follow these instructions to get a copy of any project up and running locally for development and testing.

### Prerequisites

You need to install the following on your machine:
* **Node.js** (v14+ recommended)
* **npm** (Node Package Manager)

### Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/shorodokvlad/quality-assurance.git
   ```

2. **Navigate to any project directory**
   For example, to run the Issue Tracker:
   ```sh
   cd "Issue Tracker"
   ```

3. **Install dependencies**
   ```sh
   npm install
   ```

4. **Configure Environment Variables**
   Copy `sample.env` (or create a `.env` file) in the project directory:
   ```properties
   PORT=3000
   NODE_ENV=test
   DB=your_mongodb_connection_string
   ```

5. **Run the Application & Test Suite**
   Start the server (tests run automatically when `NODE_ENV=test`):
   ```sh
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Once dependencies are installed:
* Navigate to any of the project subfolders (`Mocha-Chai`, `Metric Imperial Converter`, `Issue Tracker`, `Library`, `Sodoku Solver`, `American British Translator`).
* Run `npm test` or `npm start` to execute the Mocha & Chai test suites.
* Open your browser at `http://localhost:3000` to interact with the web interface and API endpoints directly.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Vladislav Shorodok - [@shorodokvlad](https://twitter.com/shorodokvlad) - vlad.shorodok14@gmail.com

Project Link: [https://github.com/shorodokvlad/quality-assurance](https://github.com/shorodokvlad/quality-assurance)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[NodeJS-shield]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[NodeJS-url]: https://nodejs.org/
[ExpressJS-shield]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[ExpressJS-url]: https://expressjs.com/
[Mocha-shield]: https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white
[Mocha-url]: https://mochajs.org/
[Chai-shield]: https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white
[Chai-url]: https://www.chaijs.com/
[MongoDB-shield]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[JavaScript-shield]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JavaScript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
