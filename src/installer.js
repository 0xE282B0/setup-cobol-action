const exec = require('@actions/exec');
const fs = require('fs');
const Logger = require('./logger');
const os = require('os');
const path = require('path');

class UnsupportedOSError extends Error {
  constructor(message) {
    super(message);
  }
}

class UnsupportedVersionError extends Error {
  constructor(message) {
    super(message);
  }
}

class Installer {

  constructor(version, baseDir = __dirname) {
    this.version = version;
    this.baseDir = baseDir;
    fs.readdirSync(this.baseDir).forEach(f => console.log(f));
    this.logger = new Logger('Installer');
    this.SUPPORTED_VERSIONS = ['3.0-rc1'];
  }

  _execFileName() {
    const osType = os.type();
    if (osType === 'Linux') {
      return 'install-linux';
    }
    throw new UnsupportedOSError(
      `${osType} is not supported. fabasoad/setup-cobol-action only supports Ubuntu Linux at this time.`
    );
  }

  async install() {
    if (!this.SUPPORTED_VERSIONS.includes(this.version)) {
      throw new UnsupportedVersionError(`Version ${this.version} is not supported.`);
    }
    const execFileName = path.join(this.baseDir, this._execFileName());
    this.logger.info(`Changing permissions to 777 for ${execFileName}...`);
    fs.chmodSync(execFileName, '777');
    this.logger.info(`Running ${execFileName}...`);
    await exec.exec(execFileName, [ this.version ]);
    this.logger.info('Installation successfully finished.');
  }
}

module.exports = { Installer, UnsupportedOSError, UnsupportedVersionError };