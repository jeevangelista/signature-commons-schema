from setuptools import setup

setup(
  name='signature_commons_validator',
  version='0.1',
  packages=['signature_commons_validator'],
  license='Apache-2.0',
  long_description=open('README.md', 'r').read(),
  test_suite = 'nose.collector',
)
