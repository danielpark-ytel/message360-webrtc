<?php
/**
 * This is the package.xml generator for Message360
 */

error_reporting(E_ALL & ~E_DEPRECATED);
require_once 'PEAR/PackageFileManager2.php';
PEAR::setErrorHandling(PEAR_ERROR_DIE);

$api_version     = '1.0.0';
$api_state       = 'stable';

$release_version = '1.0.1';
$release_state   = 'stable';
$release_notes   = 'Adding PEAR package improvements';

$release_version = '1.0.2';
$release_state   = 'stable';
$release_notes   = 'Adding PEAR package improvements';

$description = <<<DESC
Message360 PHP wrapper is an open source tool built for easy access to the api.message360.com API infrastructure. Message360 is a powerful cloud communications API built to enable your apps to send and receive SMS messages and phone calls — all while controlling the call flow. Some features are conferencing, phone calls, text-to-speech, recordings, transcriptions and much more.
DESC;

$package = new PEAR_PackageFileManager2();

$package->setOptions(
    array(
        'filelistgenerator'       => 'file',
        'simpleoutput'            => true,
        'baseinstalldir'          => '/',
        'packagedirectory'        => './',
        'dir_roles'               => array(
            'schemas'  => 'data',
            'library'  => 'php',
            'library/Message360' => 'php'
            
        ),
        'ignore'                  => array(
            'examples/*',
	        'logs/*',
            'package.php',
            'package.xml~',
            'package.php~',
            '*.tgz',
            '*.md',
            'scratch/*',
            'vendor/*',
            'composer.*',
            'coverage/*',
            'docs/*',
            'travis_install.bash',
            '.travis.yml',
        )
    )
);

$package->setPackage('Message360');
$package->setSummary('PHP helper library for Message360');
$package->setDescription($description);
$package->setChannel('api.message360.com');
$package->setPackageType('php');
$package->setLicense(
    'Message360 License',
    'https://api.message360.com/'
);

$package->setNotes($release_notes);
$package->setReleaseVersion($release_version);
$package->setReleaseStability($release_state);
$package->setAPIVersion($api_version);
$package->setAPIStability($api_state);

$package->addMaintainer(
    'lead',
    '0x19',
    'Matt Grofsky',
    'support@message360.com'
);


$package->setPhpDep('5.2.1');

#$package->addPackageDepWithChannel('optional');

$package->setPearInstallerDep('1.9.3');
$package->generateContents();
$package->addRelease();

if (isset($_GET['make'])
    || (isset($_SERVER['argv']) && @$_SERVER['argv'][1] == 'make')
) {
    $package->writePackageFile();
} else {
    $package->debugPackageFile();
}

?>

