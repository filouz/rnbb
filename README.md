
# RNBB
Standing for Random Number Blockchain Based, serves as a community lab dedicated to generating random numbers through the Bitcoin network's mempool transactions. The project consists of three components - Bitcoin, Exporter, and Demo. 

## Components 

1. **Bitcoin**: This segment operates the Bitcoin core, retaining only the essential block data to ensure storage efficiency.

2. **Exporter**: This component expose a websocket connection for clients to access real-time Bitcoin network transactions. Rather than a raw approach, users initiate a request to the Exporter, prompting it to gather transactions as they emerge. Upon receiving a stop request from the user, the accumulation halts, and a seed is formulated. This seed, derived from hashing the accumulated transactions, plays a crucial role in random number generation.

3. **Demo**: A component designed to provide users with an intuitive experience, showcasing potential use cases.

## How It Works

Generated numbers use the following pattern: /seed/n.

Where the seed is calculated as: 

```bash
sha256(transactions.join(","))
```


## Build

### Requirements
- **Docker**: Install from [Docker official repository](https://github.com/docker/docker-install).


```bash
make bitcoin_core # This may take several minutes

make build
```


## Run


### docker

```bash
make up
```

### Kubernetes

Adjust files in deployment/k8s.

```bash
kubectl apply -f deployement/k8s
```

## Project Goals

With RNBB, our aim is to create a transparent, decentralized, and robust system for random number generation, leveraging the highly distributed and secure infrastructure of the Bitcoin network. The intent is to provide a solution that is hard to manipulate and that is continuously verifiable by any participating entity.

## Contribute

We encourage open collaboration. Feel free to fork the project, make changes according to your needs and open pull requests with any new features or bug fixes you have worked on.

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3).

## Contact

For any additional queries or suggestions, feel free to reach out.

## Disclaimer

This project doesn't guarantee the absolute randomness of the generated numbers, as it relies on the Bitcoin network transactions which might have patterns or be influenced. Please use the generated numbers at your own discretion and risk.

